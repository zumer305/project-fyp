"""Download all AI models for the chatbot"""
import os
os.chdir(r'c:\Users\Hp\Desktop\fyp\ai_travel_chatbot_rag\backend')

print("=" * 60)
print("DOWNLOADING AI MODELS FOR CHATBOT")
print("=" * 60)
print("\nThis will download:")
print("1. Sentence Transformer embedding model (~500MB)")
print("2. Qwen-2.5-0.5B language model (~1-2GB)")
print("\nTotal download: ~2GB")
print("This may take 5-15 minutes depending on internet speed...")
print("=" * 60)
print("\nStarting downloads...\n")

try:
    # Step 1: Download embedding model
    print("📥 Step 1/4: Loading Sentence Transformer...")
    from sentence_transformers import SentenceTransformer
    print("✅ Sentence Transformers library loaded")
    
    print("\n📥 Step 2/4: Downloading embedding model (all-MiniLM-L6-v2)...")
    embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    print("✅ Embedding model downloaded!")
    
    # Step 2: Download Qwen model
    print("\n📥 Step 3/4: Loading Transformers library...")
    from transformers import AutoTokenizer, AutoModelForCausalLM
    print("✅ Transformers library loaded")
    
    print("\n📥 Step 4/4: Downloading Qwen model (Qwen/Qwen2.5-0.5B-Instruct)...")
    print("This is the largest download (~1-2GB), please wait...")
    tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-0.5B-Instruct")
    print("✅ Tokenizer downloaded!")
    
    print("\nDownloading model weights...")
    model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-0.5B-Instruct")
    print("✅ Qwen model downloaded!")
    
    print("\n" + "=" * 60)
    print("🎉 SUCCESS! All models downloaded successfully!")
    print("=" * 60)
    print("\nModels are cached and ready to use.")
    print("Your chatbot will now use the full AI features!")
    print("Restart your Django server to use the new models.")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    print("\nThe chatbot will continue to work with the simple version.")
    import traceback
    traceback.print_exc()
