import os
import queue
import numpy as np
import sounddevice as sd
import soundfile as sf
import streamlit as st
import torch
import tempfile
import base64
import time
import requests
from dotenv import load_dotenv
from gtts import gTTS

from langchain_cerebras import ChatCerebras
from langchain.agents import initialize_agent, Tool, AgentType
from langchain.memory import ConversationBufferMemory

# --- Load environment variables ---
load_dotenv()
CEREBRAS_API_KEY = os.getenv("CEREBRAS_API_KEY")
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")

# --- Initialize LLM ---
llm = ChatCerebras(
    model="llama-4-scout-17b-16e-instruct",
    api_key=CEREBRAS_API_KEY
)

# --- Conversation memory ---
memory = ConversationBufferMemory(memory_key="chat_history")

# --- Example tool for ZeroShotAgent ---
def summarize_text(text):
    prompt = f"Summarize this text in a concise way: {text}"
    return llm.invoke(prompt).content

tools = [
    Tool(
        name="Summarizer",
        func=summarize_text,
        description="Summarizes input text into concise points."
    )
]

agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    memory=memory,
    verbose=False
)

# --- Voice Activity Detection ---
@st.cache_resource
def load_vad_model():
    model, _ = torch.hub.load('snakers4/silero-vad', 'silero_vad', force_reload=False)
    return model

q = queue.Queue()

def audio_callback(indata, frames, time_info, status):
    q.put(indata.copy())

def record_audio(filename="temp.wav", samplerate=16000, silence_seconds=2, timeout_seconds=30):
    vad_model = load_vad_model()
    st.info("🎤 Listening... Speak now!")
    
    audio_data = []
    recorded = False
    silent_chunks = 0
    chunk_size = 512
    max_silent_chunks = int(silence_seconds * samplerate / chunk_size)
    max_chunks = int(timeout_seconds * samplerate / chunk_size)

    with sd.InputStream(samplerate=samplerate, channels=1, callback=audio_callback, blocksize=chunk_size):
        for _ in range(max_chunks):
            chunk = q.get()
            audio_data.append(chunk)
            audio_tensor = torch.from_numpy(chunk.flatten()).float()
            speech_prob = vad_model(audio_tensor, samplerate).item()
            if speech_prob > 0.5:
                silent_chunks = 0
                recorded = True
            elif recorded:
                silent_chunks += 1
            if recorded and silent_chunks > max_silent_chunks:
                st.success("✅ Silence detected, processing your query.")
                break
        else:
            st.success("✅ Timeout reached, processing what we have.")

    full_audio = np.concatenate(audio_data, axis=0)
    sf.write(filename, full_audio, samplerate)
    return recorded

# --- Deepgram STT ---
def transcribe_audio(file_path):
    url = "https://api.deepgram.com/v1/listen"
    headers = {"Authorization": f"Token {DEEPGRAM_API_KEY}"}
    with open(file_path, "rb") as f:
        audio_data = f.read()
    try:
        response = requests.post(url, headers=headers, data=audio_data)
        response.raise_for_status()
        transcript = response.json()["results"]["channels"][0]["alternatives"][0]["transcript"]
        return transcript
    except Exception as e:
        st.error(f"❌ Transcription error: {e}")
        return ""

# --- gTTS with optional pitch/speed tweak ---
def speak_text(text, lang='en'):
    try:
        tts = gTTS(text=text, lang=lang, slow=False)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
            tts.save(tmp.name)
            return tmp.name
    except Exception as e:
        st.error(f"TTS error: {e}")
        return None

# --- Play audio ---
def play_audio(file_path):
    if file_path:
        audio_bytes = open(file_path, 'rb').read()
        b64_audio = base64.b64encode(audio_bytes).decode()
        st.components.v1.html(f"""
            <audio autoplay>
              <source src="data:audio/mp3;base64,{b64_audio}" type="audio/mp3">
            </audio>
        """, height=50)
        os.remove(file_path)

# --- Streamlit UI ---
st.set_page_config(page_title="🧠 Advanced Voice Agent", layout="centered")
st.title("🎙️ Advanced Voice Agent")
st.caption("Speak your query and get a spoken response. Conversation history is displayed below.")

if "conversation" not in st.session_state:
    st.session_state.conversation = []

if st.button("🔴 Start Conversation"):
    try:
        # Greeting
        greeting_audio = speak_text("Hello! I’m your voice assistant. How can I help you today?")
        play_audio(greeting_audio)
        time.sleep(2)

        # Record user speech
        recorded = record_audio()
        if not recorded:
            st.warning("⚠️ Didn't hear anything. Try again.")
        else:
            transcript = transcribe_audio("temp.wav")
            if os.path.exists("temp.wav"):
                os.remove("temp.wav")

            if transcript.strip():
                st.session_state.conversation.append({"role": "user", "text": transcript})
                response = agent.invoke({"input": transcript})
                agent_text = response["output"]
                st.session_state.conversation.append({"role": "agent", "text": agent_text})

                # Display conversation history
                for chat in st.session_state.conversation:
                    if chat["role"] == "user":
                        st.markdown(f"*You:* {chat['text']}")
                    else:
                        st.markdown(f"*Agent:* {chat['text']}")

                # Speak agent response
                response_audio = speak_text(agent_text)
                play_audio(response_audio)
            else:
                st.warning("⚠️ Could not transcribe the audio. Please speak more clearly.")
    except Exception as e:
        st.error(f"❌ Unexpected error: {e}")

st.markdown("---")
st.caption("Built with ❤️ using Cerebras, Deepgram, gTTS, and Streamlit.")