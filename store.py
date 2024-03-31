from transformers import BertTokenizer, TFBertModel
import tensorflow as tf
from pinecone import Pinecone
import os
import pandas as pd
import uuid

def configure_pinecone():
    """
    Configures Pinecone client.
    """
    pinecone_api_key = os.getenv('pineconeapi')
    #pinecone_host = "api.pinecone.io"  # Example for US region
    pinecone_index_name = "myindex"
    pc = Pinecone(api_key=pinecone_api_key)
    index = pc.Index(pinecone_index_name)
    return index

def preprocess_text(text):
    """
    Preprocesses text for BERT.
    """
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    

    text = "[CLS] " + text + " [SEP]"
    tokenized_text = tokenizer.encode(text, add_special_tokens=True, max_length=512, truncation=True, padding='max_length')
    return tokenized_text

def create_pinecone_data(embedding, text):
    """
    Creates Pinecone data for each text and embedding.
    """
    id = str(uuid.uuid4())  # Generate a unique ID
    data = {
        "id": id,
        "values": embedding.tolist(),
        "metadata": {"error": text}
    }
    return data

def store_to_pinecone(input_list):
    """
    Stores input list data to Pinecone index.
    """
    index = configure_pinecone()

    # Load the pre-trained BERT tokenizer and model (adjust model name as needed)
    model= TFBertModel.from_pretrained('bert-base-uncased')

    # Get tokenized and padded sequences
    tokenized_data = [preprocess_text(text) for text in input_list]

    # Convert token lists to tensors
    input_ids = tf.constant(tokenized_data)

    # Pass the tokenized data through the BERT model
    outputs = model(input_ids)
    # Extract the last hidden layer (adjust as needed)
    embeddings = outputs[0][:, 0, :]  # CLS token embedding

    # Create Pinecone data for each text and embedding
    pinecone_data = [create_pinecone_data(embedding, text) for text, embedding in zip(input_list, embeddings.numpy())]

    # Upsert data to Pinecone index
    index.upsert(pinecone_data)
    print("Data upserted to Pinecone index!")

    return "Data upserted to Pinecone index!"


########## query #########

def process_query_text(query_text):
    """
    Processes query text and queries Pinecone.
    """
    index = configure_pinecone()

    model = TFBertModel.from_pretrained('bert-base-uncased')
    tokenized_text = preprocess_text(query_text)

    query_embedding = tf.constant([tokenized_text])
    query_embedding = model(query_embedding)[0][:, 0, :]

    results = index.query(vector=query_embedding.numpy().tolist(), top_k=3)
    print("Error is:", query_text)

    all_ids = [match['id'] for match in results['matches']]
    fetched_data = index.fetch(ids=all_ids)

    for id in all_ids:
        process_results(id, results, fetched_data)

def process_results(id, result1_data, result2_data):
    """
    Processes results from Pinecone query.
    """
    matching_score = None
    for match in result1_data['matches']:
        if match['id'] == id:
            matching_score = match['score']
            break

    matching_metadata = None
    if result2_data['vectors'].get(id) is not None:
        matching_metadata = result2_data['vectors'][id]['metadata']

    if matching_score is not None:
        print(f"ID: {id}")
        print(f"Score: {matching_score}")
        if matching_metadata is not None:
            print(f"Metadata:")
            for key, value in matching_metadata.items():
                print(f"  - {key}: {value}")
    else:
        print(f"No score found for ID '{id}'")


