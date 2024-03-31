from store import store_to_pinecone, process_query_text

#examples
str="installation error: Module not found"
list=["installation error: Module not found"]

#to store the embedding in the pinecone
store_to_pinecone(list)

#To get the top=k results of most similar vector
process_query_text(str)
