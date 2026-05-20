import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

import ChooseResult from "../layouts/ChooseResult.jsx"

import { PywebviewAPI } from "../utils/pywebview-api.js"

import { ArrowLeft, RotateCcw, Check, ArrowBigRight } from "lucide-react"

function QuestionPage({ lang, onReady }) {
	const [LangDisplay, setLangDisplay] = useState([])
	const [SetupGenerate, setSetupGenerate] = useState({})
	const [DataGenerate, setDataGenerate] = useState({})

	const [ShowChoose, setShowChoose] = useState(true)
	const [HiddenResult, setHiddenResult] = useState(true)

	const [CurrentQuestion, setCurrentQuestion] = useState(null)
	const [ChooseQuestion, setChooseQuestion] = useState(0)
	const [ChooseSelected, setChooseSelected] = useState(null)
	const [ChooseElement, setChooseElement] = useState(null)

	const [ChooseAccept, setChooseAccept] = useState(null)
	const [ChooseDisable, setChooseDisable] = useState(false)
	const [CountCorrect, setCountCorrect] = useState(0)
	const [CountWrong, setCountWrong] = useState(0)
	const [FirstWrong, setFirstWrong] = useState(null)
	const [CountLoopWrong, setCountLoopWrong] = useState(0)

	const [FirstSubmit, setFirstSubmit] = useState(null)
	const [FirstNext, setFirstNext] = useState(null)
	const QuestionElement = useRef()
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
		GenerateQuestion(result, 0, setup)
		setDataGenerate(result)
		setChooseQuestion(0)
	}

	const GenerateQuestion = (data, index, setup) => {
		if (data.length < 4) return null

		// 1. random câu đúng
		const correctItem = data[index]

		// 2. lấy 3 câu sai
		const wrongItems = data
			.filter((_, i) => i !== index)
			.sort(() => 0.5 - Math.random())
			.slice(0, 3)

		// 3. gộp lại
		const answers = [correctItem, ...wrongItems]

		// 4. shuffle vị trí
		for (let i = answers.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[answers[i], answers[j]] = [answers[j], answers[i]]
		}

		// 5. tìm lại index đúng sau khi shuffle
		const correctAnswerIndex = answers.findIndex(a => a === correctItem)
		setCurrentQuestion({
			question: correctItem[setup.langBegin],
			answers,
			correctAnswerIndex,
		})
	}

	const handleChoose = (i, e) => {
		setChooseSelected(i)
		setChooseElement(e)
	}

	const handleSubmit = e => {
		if (ChooseSelected == null || ChooseElement == null) {
			if (FirstSubmit) {
				e.classList.remove("animate-shake")
				void e.offsetWidth
				e.classList.add("animate-shake")
			} else {
				e.classList.add("animate-shake", "animate-once", "animate-duration-[250ms]")
				setFirstSubmit(true)
			}
		} else {
			if (CurrentQuestion.correctAnswerIndex == ChooseSelected) {
				setChooseAccept(true)
				setChooseDisable(true)
				if (!FirstWrong) setCountCorrect(pre => pre + 1)
				QuestionElement.current.classList.add("border-4", "border-[#00ff00]")
			} else {
				if (!FirstWrong || FirstWrong == null) {
					setFirstWrong(true)
					setCountWrong(pre => pre + 1)
					setCountLoopWrong(pre => pre + 1)
				} else {
					setCountLoopWrong(pre => pre + 1)
				}
				if (FirstSubmit) {
					e.classList.remove("animate-shake")
					void e.offsetWidth
					e.classList.add("animate-shake")
				} else {
					e.classList.add("animate-shake", "animate-once", "animate-duration-[250ms]")
					setFirstSubmit(true)
				}
			}
		}
	}

	const handleNext = e => {
		if (!ChooseAccept) {
			if (FirstNext) {
				e.classList.remove("animate-shake")
				void e.offsetWidth
				e.classList.add("animate-shake")
			} else {
				e.classList.add("animate-shake", "animate-once", "animate-duration-[250ms]")
				setFirstNext(true)
			}
		} else {
			console.log(ChooseQuestion + 1, SetupGenerate.count)
			if (ChooseQuestion + 1 >= SetupGenerate.count) {
				console.log("The End")
				console.log(CountCorrect, CountWrong, CountLoopWrong)
				setHiddenResult(false)
			} else {
				setChooseSelected(null)
				setChooseElement(null)
				setChooseAccept(false)
				setChooseDisable(false)
				setFirstWrong(null)
				QuestionElement.current?.classList.remove("border-4", "border-[#00ff00]")

				GenerateQuestion(DataGenerate, ChooseQuestion + 1, SetupGenerate)
				setChooseQuestion(prev => prev + 1)
			}
		}
	}

	useEffect(() => console.log("setCountCorrect: ", CountCorrect - 1, " + 1 = ", CountCorrect), [CountCorrect])
	useEffect(() => console.log("setCountWrong: ", CountWrong - 1, " + 1 = ", CountWrong), [CountWrong])
	useEffect(() => console.log("FirstWrong: ", FirstWrong), [FirstWrong])
	useEffect(() => console.log("setCountLoopWrong: ", CountLoopWrong - 1, " + 1 = ", CountLoopWrong), [CountLoopWrong])

	useEffect(() => {
		onReady()
		if (lang != "vi") {
			fetch(`./lang/${lang}.json`)
				.then(res => res.json())
				.then(data => setLangDisplay([data.generate, data.home]))
		}
	}, [lang, onReady])

	return (
		<>
			<style>
				{`
                .choose-selected {
					border: 3px solid #000000;
				}
			`}
			</style>

			<div id="question" className="relative h-screen w-full flex flex-col justify-start items-center text-white overflow-hidden">
				<div className="relative h-20 w-full flex justify-center items-center">
					<ArrowLeft className="absolute left-5 size-10 text-black cursor-pointer" onClick={() => navigate("/home")} />
					<span className="text-black text-[35px] font-['Exo_2',_sans-serif]">{lang == "vi" ? "Trắc nghiệm" : LangDisplay[0]?.text_title[1]}</span>
				</div>
				{ShowChoose ? (
					<ChooseResult lang={lang} langDisplay={LangDisplay[0]} hidden={s => setShowChoose(s)} run={d => Setup(d)} />
				) : HiddenResult ? (
					<>
						<div className="relative h-[calc(100%-80px)] w-full flex justify-center items-center overflow-hidden">
							<RotateCcw
								className="absolute left-5 size-10 text-black cursor-pointer"
								onClick={() => {
									setShowChoose(true)
									setHiddenResult(true)
									setChooseSelected(null)
									setChooseElement(null)
									setChooseAccept(false)
									setChooseDisable(false)
									setFirstWrong(null)
									QuestionElement.current?.classList.remove("border-4", "border-[#00ff00]")
								}}
							/>
							<div className="h-[500px] w-[400px] -mt-5 -ml-5 text-black">
								<div className="ml-3 h-full w-full grid grid-cols-2 grid-rows-5 gap-2">
									<div ref={QuestionElement} className={`col-span-2 row-span-2 rounded-xl flex justify-center items-center ${getClassUI()}`}>
										<span className="text-4xl text-center">{CurrentQuestion?.question}</span>
									</div>
									<div onClick={e => handleChoose(0, e.currentTarget)} className={`relative row-start-3 rounded-xl flex justify-center items-center ${getClassUI()} ${ChooseSelected === 0 ? "choose-selected" : ""} cursor-pointer hover:border-[3px] hover:border-[#444444]`}>
										<span className="text-xl text-center">{CurrentQuestion?.answers[0][SetupGenerate.langTrans]}</span>
									</div>
									<div
										onClick={e => handleChoose(1, e.currentTarget)}
										className={`relative col-start-1 row-start-4 rounded-xl flex justify-center items-center ${getClassUI()} ${ChooseSelected === 1 ? "choose-selected" : ""} cursor-pointer hover:border-[3px] hover:border-[#444444]`}
									>
										<span className="text-xl text-center">{CurrentQuestion?.answers[1][SetupGenerate.langTrans]}</span>
									</div>
									<div
										onClick={e => handleChoose(2, e.currentTarget)}
										className={`relative col-start-2 row-start-3 rounded-xl flex justify-center items-center ${getClassUI()} ${ChooseSelected === 2 ? "choose-selected" : ""} cursor-pointer hover:border-[3px] hover:border-[#444444]`}
									>
										<span className="text-xl text-center">{CurrentQuestion?.answers[2][SetupGenerate.langTrans]}</span>
									</div>
									<div onClick={e => handleChoose(3, e.currentTarget)} className={`relative row-start-4 rounded-xl flex justify-center items-center ${getClassUI()} ${ChooseSelected === 3 ? "choose-selected" : ""} cursor-pointer hover:border-[3px] hover:border-[#444444]`}>
										<span className="text-xl text-center">{CurrentQuestion?.answers[3][SetupGenerate.langTrans]}</span>
									</div>
									<div
										onClick={e => {
											if (ChooseDisable) return
											handleSubmit(e.currentTarget)
										}}
										className={`col-start-1 row-start-5 rounded-xl flex justify-center items-center ${getClassUI()} cursor-pointer hover:border-[3px] hover:border-[#444444] ${ChooseDisable ? "pointer-events-none opacity-50" : ""}`}
									>
										<Check className="size-10" />
									</div>
									<div onClick={e => handleNext(e.currentTarget)} className={`col-start-2 row-start-5 rounded-xl flex justify-center items-center ${getClassUI()} cursor-pointer hover:border-[3px] hover:border-[#444444]`}>
										<ArrowBigRight className="size-10" />
									</div>
								</div>
							</div>
						</div>
					</>
				) : (
					<>
						<div className="relative h-[calc(100%-80px)] w-full flex justify-center items-center overflow-hidden">
							<div className="h-[500px] w-[400px] -mt-5 text-black">
								<div className="h-full w-full grid grid-cols-2 grid-rows-4 gap-2">
									<div className={`relative col-span-2 row-span-2 rounded-xl flex justify-center items-center ${getClassUI()}`}>
										<span className="text-4xl">{lang == "vi" ? "Kết quả trả lời" : LangDisplay[0]?.text_title_result}</span>
									</div>
									<div className={`relative row-start-3 rounded-xl flex flex-col justify-center items-center ${getClassUI()}`}>
										<span className="text-[16px] font-bold">{lang == "vi" ? "Số câu đúng" : LangDisplay[0]?.text_title_correctly}</span>
										<span className="text-[16px]">
											{CountCorrect ? CountCorrect : "0"} / {SetupGenerate.count ? SetupGenerate.count : "0"}
										</span>
									</div>
									<div className={`relative row-start-3 rounded-xl flex flex-col justify-center items-center ${getClassUI()}`}>
										<span className="text-[16px] font-bold">{lang == "vi" ? "Số câu sai" : LangDisplay[0]?.text_title_wrong}</span>
										<span className="text-[16px]">
											{CountWrong ? CountWrong : "0"} / {SetupGenerate.count ? SetupGenerate.count : "0"}
										</span>
									</div>
									<div className={`relative row-start-4 rounded-xl flex flex-col justify-center items-center ${getClassUI()}`}>
										<span className="text-[16px] font-bold">{lang == "vi" ? "Số lần làm lại" : LangDisplay[0]?.text_title_mistakes}</span>
										<span className="text-[16px]">{CountLoopWrong ? CountLoopWrong : "0"}</span>
									</div>
									<div
										onClick={() => {
											setShowChoose(true)
											setHiddenResult(true)
											setChooseSelected(null)
											setChooseElement(null)
											setChooseAccept(false)
											setChooseDisable(false)
											setFirstWrong(null)
											QuestionElement.current?.classList.remove("border-4", "border-[#00ff00]")
										}}
										className={`relative row-start-4 rounded-xl flex flex-col justify-center items-center ${getClassUI()} cursor-pointer`}
									>
										<span className="text-[16px] font-bold">{lang == "vi" ? "Tạo lại câu hỏi" : LangDisplay[0]?.text_button_result}</span>
										<RotateCcw className="size-6 text-black" />
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	)
}

export default QuestionPage
