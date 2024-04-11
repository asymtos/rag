from langchain_community.llms import HuggingFaceEndpoint
from langchain_community.embeddings.huggingface import HuggingFaceInferenceAPIEmbeddings
from langchain_community.vectorstores import Qdrant
from langchain_community.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import PyPDFLoader
from qdrant_client import QdrantClient
import os

#huggingface.co -> settings -> access token -> create new 
#export HUGGINGFACEHUB_API_TOKEN="<Your huggingface access token>"

loader = PyPDFLoader("THE TINY EXPLORER.pdf")
documents = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=512,
                                                   chunk_overlap=50)
texts = text_splitter.split_documents(documents)

Hftoken = os.getenv("HUGGINGFACEHUB_API_TOKEN")

embeddings = HuggingFaceInferenceAPIEmbeddings(
        api_key=Hftoken,
        model_name= "thenlper/gte-large" #BAAI/BGE-base-en-v1.5  
)

vectordb = Qdrant.from_documents(
    texts , embeddings , path = "./tinyexplorer", collection_name = "tinyexplorer1", force_recreate=False
)

retriever =vectordb.as_retriever(
    search_type = "mmr",
    search_kwargs = {"k":2}
)

llm1= HuggingFaceEndpoint(
    repo_id="HuggingFaceH4/zephyr-7b-alpha",
    temperature=0.1,
    max_new_tokens=512,
    return_full_text=False
)
query = "who is tiny explorer?"

prompt = f"""
<|system|>
You are an AI assistant that follow instructions extremely well. Please be truthful and give correct answers.
</s>
<|user|>
{query}
</s>
<|assistant|>
"""
qa = RetrievalQA.from_chain_type(llm=llm1, chain_type="stuff",retriever=retriever)

response = qa.invoke(prompt)
print(query)
print(response["result"])
