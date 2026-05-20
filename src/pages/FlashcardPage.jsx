import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import ChooseResult from "../layouts/ChooseResult.jsx"

import { PywebviewAPI } from "../utils/pywebview-api.js"
import Stack from "../components/Stack.jsx"
import ShinyText from "../components/ShinyText.jsx"

import { ArrowLeft, RotateCcw } from "lucide-react"

function FlashcardPage({ lang, onReady }) {
	const [LangDisplay, setLangDisplay] = useState([])
	const [SetupGenerate, setSetupGenerate] = useState({})
	const [DataGenerate, setDataGenerate] = useState([])
	const [ShowChoose, setShowChoose] = useState(true)
	const navigate = useNavigate()

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

	const Setup = d => {
		setSetupGenerate(d)
		Generate(d)
	}

	const Generate = async setup => {
		const api = await PywebviewAPI()
		if (!api || !api.SearchTreeIT) return

		const { dictType, langBegin, count } = setup
		const result = await api.GenerateRandom(langBegin, count, dictType)
		console.log(result)
		setDataGenerate(result)
	}

	useEffect(() => {
		onReady()
		if (lang != "vi") {
			fetch(`./lang/${lang}.json`)
				.then(res => res.json())
				.then(data => setLangDisplay([data.generate, data.home]))
		}
	}, [lang, onReady])

	return (
		<div id="flashcard" className="relative h-screen w-full flex flex-col justify-start items-center text-white overflow-hidden">
			<div className="relative h-20 w-full flex justify-center items-center">
				<ArrowLeft className="absolute left-5 size-10 text-black cursor-pointer" onClick={() => navigate("/home")} />
				<span className="text-black text-[35px] font-['Exo_2',_sans-serif]">{lang == "vi" ? "Flashcard" : LangDisplay[0]?.text_title[0]}</span>
			</div>
			{ShowChoose ? (
				<ChooseResult lang={lang} langDisplay={LangDisplay[0]} hidden={s => setShowChoose(s)} run={d => Setup(d)} />
			) : (
				<>
					<div className="relative h-[calc(100%-80px)] w-full flex justify-center items-center overflow-hidden">
						<RotateCcw className="absolute left-5 size-10 text-black cursor-pointer" onClick={() => setShowChoose(true)} />
						<div className="-mt-5 -ml-5" style={{ width: 350, height: 400 }}>
							<Stack
								randomRotation={false}
								sensitivity={200}
								sendToBackOnClick={true}
								cards={DataGenerate.map((data, i) => (
									<div key={i} className={`p-5 h-full w-full text-black border-4 border-black rounded-2xl object-cover flex flex-col justify-center items-center [box-shadow:rgba(255,_255,_255,_0.35)_0px_5px_15px] ${getClassUI()}`}>
										<ShinyText className="text-5xl text-center" text={data[SetupGenerate.langBegin]} speed={4} delay={2} color="#000000" shineColor="#444444" spread={120} direction="left" yoyo={true} pauseOnHover={false} disabled={false} />
										<span className="mt-3 text-2xl text-center">{data[SetupGenerate.langTrans]}</span>
										<span className="mt-5 text-2xl text-center">{lang == "vi" ? "Ví dụ" : LangDisplay[1]?.text_examples}:</span>
										<span className="text-[18px] text-center">{data.example[SetupGenerate.langTrans]}</span>
										<span className="mt-5 text-2xl text-center">{lang == "vi" ? "Cách dùng" : LangDisplay[1]?.text_usage}:</span>
										<span className="text-[18px] text-center">{data.usage[SetupGenerate.langTrans]}</span>
									</div>
								))}
								autoplay={false}
								autoplayDelay={3000}
								pauseOnHover={false}
							/>
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default FlashcardPage
