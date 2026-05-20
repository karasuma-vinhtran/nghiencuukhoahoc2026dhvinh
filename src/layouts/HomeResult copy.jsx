import { useEffect, useState } from "react"
// import { NavLink } from "react-router-dom"
import { Volume2, Star } from "lucide-react"

// import GetData from "./GetData.js"
import { PywebviewAPI } from "../utils/pywebview-api.js"
import Loading from "../components/Loading.jsx"

function HomeResult({ lang, langTrans, langDisplay, text, hidden }) {
	const [DataDict, setDataDict] = useState(null)
	const [HiddenResult, setHiddenResult] = useState(true)

	const Speak = async text => {
		const api = await PywebviewAPI()
		if (!api || !api.Speak) return
		api.Speak(text, langTrans)
	}

	// useEffect(() => {
	// 	fetch("./data/dict.json")
	// 		.then(res => res.json())
	// 		.then(data => {
	// 			const result = GetData(data, lang, text)
	// 			if (result) {
	// 				setDataDict(result)
	// 				console.log(result.length)
	// 				setHiddenResult(false)
	// 			} else setHiddenResult(true)
	// 		})
	// }, [lang, text])

	useEffect(() => {
		const run = async () => {
			const api = await PywebviewAPI()
			if (!api || !api.SearchTree) return

			const result = await api.SearchTree(lang, text)
			if (result !== null) {
				setDataDict(result)
				setHiddenResult(false)
			} else {
				setHiddenResult(true)
			}
		}

		run()
	}, [lang, text])

	return (
		<>
			<div id="home-result" className={`relative h-full w-full flex flex-col ${!hidden ? "-z-1 opacity-0" : "z-5 opacity-100"} transition-all duration-500`}>
				{HiddenResult ? (
					<>
						<div className={`absolute z-5 h-50 w-full flex justify-center items-center rounded-[25px] bg-neutral-800`}>
							<Loading />
						</div>
					</>
				) : (
					<>
						<div className="p-2 h-auto w-full text-white font-['Exo_2',_sans-serif] shrink-0 flex flex-row justify-center items-center rounded-t-[25px] bg-neutral-800">
							<div className="w-1/2 flex flex-col justify-center items-start">
								<span className="ml-3 text-3xl">{DataDict?.[langTrans]}</span>
								<span className="ml-3">
									{lang == "vi" ? "Phát âm" : langDisplay?.text_pronounce}: {DataDict?.["pronounce"]?.[langTrans]}
								</span>
							</div>
							<div className="w-1/2 flex flex-row justify-end items-center">
								<Volume2 className="mr-3 size-8 cursor-pointer" onClick={() => Speak(DataDict?.[langTrans])} />
								<Star className="mr-3 size-8 cursor-pointer" />
							</div>
						</div>
						<div className="w-full flex justify-center items-center bg-neutral-800">
							<div className="my-2 w-[92%] border-[1px] border-neutral-700 rounded-full"></div>
						</div>
						<div className="p-2 h-auto w-full text-white font-['Exo_2',_sans-serif] shrink-0 flex flex-col justify-center items-start rounded-b-[25px] bg-neutral-800">
							<span className="ml-3">{lang == "vi" ? "Đồng nghĩa" : langDisplay?.text_synonymous}:</span>
							<ul className="ml-4">
								<li className="ml-6 list-disc">{DataDict?.["synonymous"]?.[lang]}</li>
							</ul>
							<span className="mt-2 ml-3">{lang == "vi" ? "Ví dụ" : langDisplay?.text_examples}:</span>
							<ul className="ml-4">
								<li className="ml-6 list-disc">{DataDict?.["example"]?.[lang]}</li>
							</ul>
							<span className="mt-2 ml-3">
								{lang == "vi" ? "Cách dùng" : langDisplay?.text_usage}: {DataDict?.["usage"]?.[lang]}
							</span>
						</div>
					</>
				)}
			</div>
		</>
	)
}

export default HomeResult
