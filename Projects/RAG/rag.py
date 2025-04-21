from langchain_community.document_loaders import DirectoryLoader
from langchain_community.document_loaders import TextLoader
import unstructured
from langchain.text_splitter import RecursiveCharacterTextSplitter
import nltk
from langchain_openai import OpenAIEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

# nltk.download('punkt')
import ssl
import certifi
import shutil
import argparse
ssl._create_default_https_context = lambda: ssl.create_default_context(cafile=certifi.where())
import os

DATA_PATH = "/Users/aaryasaxena/VSCODEPROJECTS/Projects/RAG/data"

CHROMA_PATH = "chroma"


embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
# embedding = OpenAIEmbeddings()




def load_data():
    documents = []
    for filename in os.listdir(DATA_PATH):
        if filename.endswith(".md"):
            path = os.path.join(DATA_PATH, filename)
            loader = TextLoader(path, encoding="utf-8")
            documents.extend(loader.load())
    return documents


def save_to_chroma(chunks):
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)

    db = Chroma.from_documents(
        chunks, embedding, persist_directory=CHROMA_PATH)
    print(f"Saved {len(chunks)} chunks to {CHROMA_PATH}.")

def text_splitter(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=250,
        length_function=len,
        add_start_index=True
    )
    chunks = splitter.split_documents(documents)
    print(f"Split {len(documents)} documents into {len(chunks)} chunks")
    document = chunks[0]
    print(document.page_content)
    print(document.metadata)
    return chunks


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("query_text", type = str, help = "the query text")
    args = parser.parse_args()
    query_text = args.query_text

    embedding_function = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)
    results = db.similarity_search(query_text, k=1)

    if not results:
        print("No documents returned.")
        return

    for i, doc in enumerate(results):
        print("\n📝 Preview:")
        print(doc.page_content.strip())
        print("\n" + "-" * 60)


if __name__ == "__main__":
    '''
    documents = load_data()
    chunks = text_splitter(documents)
    save_to_chroma(chunks)
    '''
    main()
    
