import { useState } from "react"
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import MenuBar from "./layouts/MenuBar.jsx"

import LoadingPage from "./pages/LoadingPage.jsx"
import HomePage from "./pages/HomePage.jsx"
import DictPage from "./pages/DictPage.jsx"
import AIChatPage from "./pages/AIChatPage.jsx"
import ITPage from "./pages/ITPage.jsx"
import SettingPage from "./pages/SettingPage.jsx"
import FavoritePage from "./pages/FavoritePage.jsx"
import FlashcardPage from "./pages/FlashcardPage.jsx"
import QuestionPage from "./pages/QuestionPage.jsx"

function App() {
	const [IsReady, setIsReady] = useState(false)
	const [Lang, setLang] = useState("vi")
	const changeLang = newLang => setLang(newLang)

	const getClassUI = () => {
		switch (Lang) {
			case "en":
				return "bg-blue-300"
			case "vi":
				return "bg-red-500"
			case "la":
				return "bg-neutral-50"
			default:
				return ""
		}
	}
	console.log(location.origin)

	return (
		<div id="main" className={getClassUI()}>
			<Router>
				<Routes>
					<Route path="/index.html" element={<Navigate to="/loading" replace />} />
					<Route path="/" element={<Navigate to="/loading" replace />} />
					<Route path="/loading" element={<LoadingPage lang={Lang} changeLang={changeLang} onReady={() => setIsReady(true)} />} />

					<Route path="/home" element={<HomePage lang={Lang} changeLang={changeLang} onReady={() => setIsReady(true)} />} />
					<Route path="/dict" element={<DictPage lang={Lang} changeLang={changeLang} onReady={() => setIsReady(true)} />} />
					<Route path="/it" element={<ITPage lang={Lang} changeLang={changeLang} onReady={() => setIsReady(true)} />} />
					<Route path="/ai-chat" element={<AIChatPage lang={Lang} onReady={() => setIsReady(true)} />} />
					<Route path="/setting" element={<SettingPage lang={Lang} changeLang={changeLang} onReady={() => setIsReady(true)} />} />

					<Route path="/favorite" element={<FavoritePage lang={Lang} onReady={() => setIsReady(false)} />} />
					<Route path="/flashcard" element={<FlashcardPage lang={Lang} onReady={() => setIsReady(false)} />} />
					<Route path="/question" element={<QuestionPage lang={Lang} onReady={() => setIsReady(false)} />} />
				</Routes>
				{IsReady && <MenuBar lang={Lang} />}
			</Router>
		</div>
	)
}

export default App
