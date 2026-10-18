from dotenv import load_dotenv
import os
import requests
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Load environment variables from .env
load_dotenv()
hf_token = os.getenv("HF_TOKEN")
model_path = os.getenv("LLAMA4_CHECKPOINT_PATH")

# ---- Option 1: Local model inference ----
def generate_local(prompt):
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModelForCausalLM.from_pretrained(
        model_path,
        device_map="auto",
        torch_dtype=torch.float16
    )
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    outputs = model.generate(**inputs, max_new_tokens=200)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# ---- Option 2: Hosted API inference ----
def generate_remote(prompt):
    api_url = "https://api-inference.huggingface.co/models/meta-llama/Llama-4-13b"
    headers = {"Authorization": f"Bearer {hf_token}"}
    payload = {"inputs": prompt, "parameters": {"max_new_tokens": 200}}
    response = requests.post(api_url, headers=headers, json=payload)
    return response.json()[0]["generated_text"]

# Example usage (runs only when executed directly)
if __name__ == "__main__":
    prompt = "Explain quantum computing in simple terms."
    print("Local output:", generate_local(prompt))
    print("Remote output:", generate_remote(prompt))

