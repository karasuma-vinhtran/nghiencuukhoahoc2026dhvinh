import { useEffect, useState } from "react"
// import { NavLink } from "react-router-dom"
import { Star } from "lucide-react"

// import GetDataIT from "./GetDataIT.js"
import { PywebviewAPI } from "../utils/pywebview-api.js"
import Loading from "../components/Loading.jsx"

function ITResult({ lang, textDisplay, langDisplay, text, hidden }) {
	const [DataDict, setDataDictIT] = useState(null)
	const [HiddenResult, setHiddenResult] = useState(true)

	// useEffect(() => {
	// 	fetch("./data/dict-it.json")
	// 		.then(res => res.json())
	// 		.then(data => {
	// 			const result = GetDataIT(data, text)?.data
	// 			if (result) {
	// 				setDataDictIT(result)
	// 				setHiddenResult(false)
	// 			} else setHiddenResult(true)
	// 		})
	// }, [lang, text])

	useEffect(() => {
		const run = async () => {
			const api = await PywebviewAPI()
			if (!api || !api.SearchTreeIT) return

			const result = (await api.SearchTreeIT(text))?.data
			if (result) {
				setDataDictIT(result)
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
							<div className="mt-1 w-2/3 flex flex-col justify-center items-start">
								<span className="ml-3 text-3xl">
									<span className="text-red-400">{lang == "vi" ? "Từ" : langDisplay?.result_title}:</span> {textDisplay}
								</span>
								<span className="ml-3 text-[18px]">
									<span className="text-emerald-400">{lang == "vi" ? "Nghĩa" : langDisplay?.result_meaning}:</span> {DataDict?.[lang]}
								</span>
								<span className="ml-3 text-[18px]">
									<span className="text-emerald-400">{lang == "vi" ? "Ngành liên quan" : langDisplay?.result_related_industry}:</span> {DataDict?.["related_industry"]?.[lang]}
								</span>
							</div>
							<div className="mt-1 w-1/3 flex flex-row justify-end items-center">
								<Star className="mr-3 size-8 cursor-pointer" />
							</div>
						</div>
						<div className="w-full flex justify-center items-center bg-neutral-800">
							<div className="my-2 w-[92%] border-[1px] border-neutral-700 rounded-full"></div>
						</div>
						<div className="p-2 pb-4 h-auto w-full text-white font-['Exo_2',_sans-serif] shrink-0 flex flex-col justify-center items-start rounded-b-[25px] bg-neutral-800">
							<span className="pr-4 ml-3 text-[18px] text-justify">
								<span className="text-sky-400">{lang == "vi" ? "Giải thích" : langDisplay?.result_explain}:</span> {DataDict?.["meaning"]?.[lang]}
							</span>
							<span className="pr-4 ml-3 text-[18px] indent-8 text-justify">- {DataDict?.["explain"]?.[lang]}</span>
						</div>
					</>
				)}
			</div>
		</>
	)
}

export default ITResult
