import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// import Loading from "../components/Loading.jsx"
import ShinyText from "../components/ShinyText.jsx"

import { Star, BadgeQuestionMark, Zap } from "lucide-react"
// import flagEN from "../assets/svg/flag-en.svg"
// import flagLA from "../assets/svg/flag-la.svg"
// import flagVI from "../assets/svg/flag-vi.svg"

function Home({ lang, onReady }) {
	const [LangDisplay, setLangDisplay] = useState(null)
	// const [TranslateLang, setTranslateLang] = useState(lang == "en" ? "vi" : "en")
	const navigate = useNavigate()

	// const langList = ["en", "vi", "la"]
	// const langListCurrent = [...langList]
	// if (lang == "vi") langListCurrent.splice(1, 1)
	// if (lang == "en") langListCurrent.splice(0, 1)
	// if (lang == "la") langListCurrent.splice(2, 1)

	// const handleChangeLang = newLang => {
	// 	changeLang(newLang)
	// 	if (newLang == "vi") langList.splice(1, 1)
	// 	if (newLang == "en") langList.splice(0, 1)
	// 	if (newLang == "la") langList.splice(2, 1)
	// 	setTranslateLang(langList[0])

	// 	SearchInput.current.value = ""
	// 	setTextSearch("")
	// 	setHiddenLoading(false)
	// 	setShowResult(false)
	// 	setTimeout(() => setHiddenLoading(true), 1000)
	// }

	const getClassUI = () => {
		switch (lang) {
			case "en":
				return "bg-blue-200"
			case "vi":
				return "bg-red-400"
			case "la":
				return "bg-neutral-200"
			default:
				return ""
		}
	}

	useEffect(() => {
		onReady()
		if (lang != "vi") {
			fetch(`./lang/${lang}.json`)
				.then(res => res.json())
				.then(data => setLangDisplay(data.home))
		}
	}, [lang, onReady])

	return (
		<>
			<div id="home" className="relative h-screen w-full flex flex-col justify-center items-center text-black">
				<div className="relative -mt-5 h-auto w-full flex flex-col justify-center items-center">
					<div className="relative h-26 w-[85%] rounded-xl flex flex-col justify-center items-center">
						<ShinyText className="text-7xl font-['Exo_2',_sans-serif] font-bold" text="VI - EN - LA" speed={3} delay={0} color="#b5b5b5" shineColor="#ffffff" spread={120} direction="left" yoyo={false} pauseOnHover={false} disabled={false} />
					</div>
				</div>
				<div className="relative mt-5 h-auto w-full flex flex-col justify-center items-center">
					<div className="relative h-26 w-[85%] rounded-xl flex flex-row justify-center items-center">
						<div id="question" className={`relative z-10 p-3 h-30 w-1/2 flex flex-col justify-center items-start rounded-xl ${getClassUI()} cursor-pointer`} onClick={() => navigate("/question")}>
							<BadgeQuestionMark />
							<span className="mt-1 text-black text-[16px] font-['Exo_2',_sans-serif]">{lang == "vi" ? "Tạo câu hỏi trắc nghiệm ngẫu nhiên" : LangDisplay?.text_generate_question}</span>
						</div>
						<div id="flashcard" className={`relative z-10 ml-3 p-3 h-30 w-1/2 flex flex-col justify-center items-start rounded-xl ${getClassUI()} cursor-pointer`} onClick={() => navigate("/flashcard")}>
							<Zap />
							<span className="mt-1 text-black text-[16px] font-['Exo_2',_sans-serif]">{lang == "vi" ? "Tạo các thẻ flashcard ngẫu nhiên" : LangDisplay?.text_generate_flashcard}</span>
						</div>
					</div>
					<div id="favorite" className={`relative z-10 mt-5 p-3 h-30 w-[85%] flex flex-row justify-center items-center rounded-xl ${getClassUI()} cursor-pointer`} onClick={() => navigate("/favorite")}>
						<Star />
						<span className="ml-2 text-black text-[16px] font-['Exo_2',_sans-serif]">{lang == "vi" ? "Xem danh sách từ yêu thích" : LangDisplay?.text_favorite}</span>
					</div>
				</div>
			</div>
		</>
	)
}

export default Home
