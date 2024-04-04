from flask import Flask, request, jsonify
from llama_index.core import SimpleDirectoryReader
from llama_index.core.node_parser import SimpleNodeParser
from llama_index.core import Settings
from llama_index.core import StorageContext
from llama_index.core import VectorStoreIndex
from llama_index.llms.huggingface import HuggingFaceInferenceAPI
from llama_index.embeddings.langchain import LangchainEmbedding
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from llama_index.core import load_index_from_storage
from huggingface_hub import login
import os

app = Flask(__name__)

# Set the Hugging Face token
Hftoken = "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"
login(token=Hftoken)

# Set the directory for index persistence
persist_Dir = "./db"

# Initialize HuggingFace API and embeddings
llm1 = HuggingFaceInferenceAPI(
    model_name="HuggingFaceH4/zephyr-7b-alpha",
    api_key=Hftoken
)
embedmodel = LangchainEmbedding(
    HuggingFaceInferenceAPIEmbeddings(
        api_key=Hftoken,
        model_name="thenlper/gte-large"
    )
)

# Configure settings
Settings.llm = llm1
Settings.embed_model = embedmodel
Settings.num_output = 512

# Load or create the index
if not os.path.exists(persist_Dir):
    document = SimpleDirectoryReader("data").load_data()
    parser = SimpleNodeParser()
    nodes = parser.get_nodes_from_documents(document)
    storageContext = StorageContext.from_defaults()
    index = VectorStoreIndex(nodes, storage_context=storageContext)
    index.storage_context.persist(persist_dir=persist_Dir)
else:
    storageContext = StorageContext.from_defaults(persist_dir=persist_Dir)
    index = load_index_from_storage(storage_context=storageContext)


# Define routes
@app.route('/query', methods=['POST'])
def query():
    user_promt = request.json.get('query')
    queryengine = index.as_query_engine()
    response = queryengine.query(user_promt)
    return jsonify({"response": response})


if __name__ == '__main__':
    app.run(debug=True)


