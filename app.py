# -*- coding: utf-8 -*-
import json
import os
import threading
import hashlib
import webview

from gtts import gTTS
from playsound import playsound
import soundfile as sf
import torch
from transformers import AutoProcessor, AutoModelForTextToWaveform

import tree

# ================= PATH =================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
DICT_FILE = os.path.join(DATA_DIR, "dict.json")
DICT_IT_FILE = os.path.join(DATA_DIR, "dict-it.json")
MODEL_DIR = os.path.join(BASE_DIR, "model")
AUDIO_DIR = os.path.join(BASE_DIR, "audio")

# ================= DATA =================
DATA_DICT = []
BST_VI = None
BST_EN = None
BST_LA = None
DATA_DICT_IT = []
BST_IT_VI = None
BST_IT_EN = None
BST_IT_LA = None

# ================= MMS MODEL =================
MMS_MODEL_ID = "facebook/mms-tts-lao"
_mms_processor = None
_mms_model = None
_mms_lock = threading.Lock()


def LoadMMSModel():
    global _mms_processor, _mms_model
    with _mms_lock:
        if _mms_model is None:
            print("Loading MMS-TTS-LAO model...")
            _mms_processor = AutoProcessor.from_pretrained(MMS_MODEL_ID, cache_dir=MODEL_DIR)
            _mms_model = AutoModelForTextToWaveform.from_pretrained(MMS_MODEL_ID, cache_dir=MODEL_DIR)
            _mms_model.eval()


# ================= API =================
class DictAPI:
    def __init__(self):
        os.makedirs(DATA_DIR, exist_ok=True)
        os.makedirs(AUDIO_DIR, exist_ok=True)
        os.makedirs(MODEL_DIR, exist_ok=True)

        if not os.path.exists(DICT_FILE):
            with open(DICT_FILE, "w", encoding="utf-8") as f:
                json.dump([], f, ensure_ascii=False, indent=2)

        if not os.path.exists(DICT_IT_FILE):
            with open(DICT_IT_FILE, "w", encoding="utf-8") as f_it:
                json.dump([], f_it, ensure_ascii=False, indent=2)

        self._lock = threading.Lock()
        self.LoadTreeFromFile()

    # ---------------- TREE ----------------
    def LoadTreeFromFile(self):
        global DATA_DICT, BST_VI, BST_EN, BST_LA
        global DATA_DICT_IT, BST_IT_VI, BST_IT_EN, BST_IT_LA

        try:
            with open(DICT_FILE, "r", encoding="utf-8") as f:
                DATA_DICT = json.load(f) or []
        except Exception:
            DATA_DICT = []

        try:
            with open(DICT_IT_FILE, "r", encoding="utf-8") as f_it:
                DATA_DICT_IT = json.load(f_it) or []
        except Exception:
            DATA_DICT_IT = []

        BST_VI = BST_EN = BST_LA = None

        for item in DATA_DICT:
            vi = (item.get("vi") or "").strip().casefold()
            en = (item.get("en") or "").strip().casefold()
            la = (item.get("la") or "").strip().casefold()

            if vi:
                BST_VI = tree.insert(BST_VI, vi, item)
            if en:
                BST_EN = tree.insert(BST_EN, en, item)
            if la:
                BST_LA = tree.insert(BST_LA, la, item)
        
        for item in DATA_DICT_IT:
            vi = (item.get("vi") or "").strip().casefold()
            en = (item.get("en") or "").strip().casefold()
            la = (item.get("la") or "").strip().casefold()

            if vi:
                BST_IT_VI = tree.insert(BST_IT_VI, vi, item)
            if en:
                BST_IT_EN = tree.insert(BST_IT_EN, en, item)
            if la:
                BST_IT_LA = tree.insert(BST_IT_LA, la, item)

        COUNT_BST_VI = tree.count(BST_VI)
        COUNT_BST_EN = tree.count(BST_EN)
        COUNT_BST_LA = tree.count(BST_LA)
        print("=== THỐNG KÊ TREE ===")
        print("DICT:")
        print(f"   vi: {COUNT_BST_VI}")
        print(f"   en: {COUNT_BST_EN} ( {COUNT_BST_VI-COUNT_BST_EN} )")
        print(f"   la: {COUNT_BST_LA} ( {COUNT_BST_VI-COUNT_BST_LA}, {COUNT_BST_EN-COUNT_BST_LA} )")
        print("DICT IT:")
        print("   vi:", tree.count(BST_IT_VI))
        print("   en:", tree.count(BST_IT_EN))
        print("   la:", tree.count(BST_IT_LA))
        print("=====================")

    def SearchTree(self, type, key):
        key = key.strip().casefold()
        if not key:
            return None

        tempTree = {
            "vi": BST_VI,
            "en": BST_EN,
            "la": BST_LA
        }.get(type)

        if tempTree is None:
            return {}
        
        result = tree.search(tempTree, key)
        if result:
            print("tree.search")
            return result

        print("tree.f_search")
        return tree.f_search(tempTree, key)
    
    def SearchTreeIT(self, key):
        key = key.strip().casefold()
        if not key:
            return None

        tempTree = {
            "vi": BST_IT_VI,
            "en": BST_IT_EN,
            "la": BST_IT_LA
        }

        for lang, bst in tempTree.items():
            if bst is None:
                continue
            result = tree.search(bst, key)
            if result:
                print("tree.search")
                return {
                    "lang": lang,
                    "data": result
                }

            print("tree.f_search")
            result = tree.f_search(bst, key)
            if result:
                return {
                    "lang": lang,
                    "data": result
                }
        return None


    # ---------------- TTS ----------------
    def Speak(self, text, lang):
        if not text or not lang:
            return
        threading.Thread(
            target=self._speak_by_tts,
            args=(text, lang),
            daemon=True
        ).start()

    def _speak_by_tts(self, text, lang):
        try:
            text = text.strip()
            if not text:
                return

            hash_name = hashlib.sha1(f"{lang}:{text}".encode("utf-8")).hexdigest()

            # ---------- VI / EN ----------
            if lang in ("vi", "en"):
                path = os.path.join(AUDIO_DIR, f"{hash_name}.mp3")
                if not os.path.exists(path):
                    gTTS(text=text, lang=lang).save(path)
                playsound(path)
                return

            # ---------- LAO ----------
            if lang == "la":
                path = os.path.join(AUDIO_DIR, f"{hash_name}.wav")
                if not os.path.exists(path):
                    LoadMMSModel()
                    inputs = _mms_processor(text=text, return_tensors="pt")
                    with torch.no_grad():
                        wav = _mms_model(**inputs).waveform
                        wav = wav * 1.5
                    wav = wav.squeeze().cpu().numpy()
                    sf.write(path, wav, _mms_model.config.sampling_rate)
                playsound(path)
                return

        except Exception as e:
            print("TTS error:", e)


# ================= APP =================
if __name__ == "__main__":
    api = DictAPI()

    window = webview.create_window(
        "Từ điển Việt - Anh - Lào",
        "./web/index.html",
        js_api=api,
        height=650,
        width=550,
        resizable=False,
        frameless=True,
        easy_drag=True,
        background_color="#121212"
    )

    webview.start()
