# 🧠 MMS-TTS-LAO & Language Learning Platform  
*A Comprehensive AI-Powered Language Learning and Text-to-Speech System*

---

## 📖 Introduction

This project was developed as part of my scientific research initiative in 2026 at Vinh University.  
Although the project did not advance to the final round of the research competition, it represents an important journey of experimentation, problem-solving, and exploration in the fields of language technology, speech synthesis, and educational software engineering.

Instead of leaving the project archived privately, I decided to make it open-source so that developers, students, and researchers can continue learning from it, improving it, or building upon its ideas.

The project combines an AI-powered language learning platform with a modern Text-to-Speech system for the Lao language. It integrates vocabulary learning, conversational AI, dictionary systems, multilingual processing, and speech synthesis into a unified interactive platform.

This repository reflects not only a technical implementation, but also the academic research, prototyping, and software engineering process carried out during my university studies.

---

# 🚀 Features

## 🗣️ Text-to-Speech System
- High-quality Lao speech synthesis using the MMS-TTS-LAO model
- AI-powered voice generation
- Audio playback support
- Customizable speech processing pipeline

## 📚 Language Learning Platform
- Interactive flashcards for vocabulary learning
- Quizzes and language practice games
- AI-powered chat for conversational learning
- Dictionary and translation lookup system
- Multilingual interface support

## ⚡ System Architecture
- Efficient dictionary storage using a Binary Search Tree
- Fast data retrieval and search operations
- Desktop-like web interface powered by PyWebview
- Responsive frontend built with React + Vite
- Internationalization support for multiple languages

---

# 🛠️ Tech Stack

## Frontend
- React
- React Router
- Tailwind CSS
- Vite

## Backend
- Python
- PyWebview API

## AI / Machine Learning
- Google GenAI API
- Transformers
- Torch
- MMS-TTS-LAO Model

## Database & Data Processing
- Binary Search Tree (Python implementation)
- JSON-based dictionary system

## Additional Libraries
- `gtts`
- `playsound`
- `threading`
- `hashlib`
- `os`
- `json`
- `webview`

---

# 📦 Installation

## 1️⃣ Clone Repository
```bash
git clone <repository-url>
cd MMS-TTS-LAO
```

## 2️⃣ Install Frontend Dependencies
```bash
npm install
```

or

```bash
yarn install
```

## 3️⃣ Install Python Dependencies
```bash
pip install -r requirements.txt
```

## 4️⃣ Run Application

### Start Backend
```bash
python app.py
```

### Start Frontend
```bash
npm run dev
```

---

# 💻 Usage

1. Launch the application using `python app.py`
2. Open the frontend in your browser
3. Select your preferred language
4. Access flashcards, quizzes, or dictionary tools
5. Use the AI chat feature for conversational practice
6. Convert text into speech using the TTS system

---

# 📂 Project Structure

```markdown
MMS-TTS-LAO/
├── app.py
├── tree.py
├── requirements.txt
├── README.md
│
├── data/
│   ├── dict.json
│   ├── dict-it.json
│
├── build-ui/
│
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── utils/
│
├── web/
│   ├── index.html
│   ├── lang/
│   │   ├── en.json
│   │   ├── la.json
│
├── vite.config.js
```

---

# 🧠 Core Technologies Explained

## 🌳 Binary Search Tree
The platform uses a Binary Search Tree data structure to efficiently:
- Store dictionary vocabulary
- Retrieve translation results
- Improve lookup performance
- Organize multilingual language data

## 🤖 AI Integration
The system integrates AI technologies for:
- Conversational language practice
- Smart response generation
- Speech synthesis
- Natural language interaction

## 🌐 Internationalization
The application supports multilingual interfaces and dictionary data for:
- English
- Lao
- Expandable future language support

---

# 📸 Screenshots

> Add screenshots of the UI, flashcards, AI chat interface, and TTS system here.

---

# 🤝 Contributing

Contributions are welcome.

To contribute:
1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push to your fork
5. Submit a pull request

Please ensure your code is well-documented and follows the existing project structure and coding standards.

---

# 📝 License

This project is licensed under the MIT License.

---

# 📬 Contact

- Email: `vinhtran.coder2k6@gmail.com`
- Portfolio: https://vinhtran-karasuma.netlify.app/

---

# 💖 Acknowledgements

Special thanks to:
- The open-source community
- Contributors and testers
- Research mentors and academic supporters
- Everyone who provided feedback throughout the development process

This is written by [readme.ai](https://readme-generator-phi.vercel.app/)
