
try:
    import langchain
    print(f"langchain found at: {langchain.__file__}")
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    print("langchain.text_splitter imported successfully")
except Exception as e:
    import traceback
    traceback.print_exc()
    import sys
    print(f"sys.path: {sys.path}")
    if 'langchain' in sys.modules:
        print(f"langchain in sys.modules: {sys.modules['langchain']}")
