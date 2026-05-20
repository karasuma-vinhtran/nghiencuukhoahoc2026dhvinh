import { useEffect, useState } from "react"
import { Volume2, Star, StarOff } from "lucide-react"

import { PywebviewAPI } from "../utils/pywebview-api.js"
import Loading from "../components/Loading.jsx"

function HomeResult({ lang, langTrans, langDisplay, text, hidden }) {
	const [DataDict, setDataDict] = useState(null)
	const [Refresh, setRefresh] = useState(false)
	const [HiddenResult, setHiddenResult] = useState(true)

	const Speak = async text => {
		const api = await PywebviewAPI()
		if (!api || !api.Speak) return
		api.Speak(text, langTrans)
	}

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

	const toggleFavorite = itemInput => {
		const key = "favorites"
		const favorites = JSON.parse(localStorage.getItem(key)) || []

		const index = favorites.findIndex(item => item.vi === itemInput.vi)
		if (index === -1) {
			favorites.push(itemInput)
		} else favorites.splice(index, 1)

		localStorage.setItem(key, JSON.stringify(favorites))
	}

	const isFavorite = itemInput => {
		const favorites = JSON.parse(localStorage.getItem("favorites")) || []
		return favorites.some(item => item.vi === itemInput.vi)
	}

	const toggleFavoriteAndRefresh = itemInput => {
		toggleFavorite(itemInput)
		setRefresh(!Refresh)
	}

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
						<div className={`absolute z-5 h-50 w-full flex justify-center items-center rounded-[25px] ${getClassUI()}`}>
							<Loading />
						</div>
					</>
				) : (
					<>
						<div className={`p-2 h-auto w-full text-black font-['Exo_2',_sans-serif] shrink-0 flex flex-row justify-center items-center rounded-t-[25px] ${getClassUI()}`}>
							<div className="w-1/2 flex flex-col justify-center items-start">
								<span className="ml-3 text-3xl">{DataDict?.[langTrans]}</span>
								<span className="ml-3">
									{lang == "vi" ? "Phát âm" : langDisplay?.text_pronounce}: {DataDict?.["pronounce"]?.[langTrans]}
								</span>
							</div>
							<div className="w-1/2 flex flex-row justify-end items-center">
								<Volume2 className="mr-3 size-8 cursor-pointer" onClick={() => Speak(DataDict?.[langTrans])} />
								{isFavorite(DataDict) ? <Star className="mr-3 size-8 cursor-pointer" onClick={() => toggleFavoriteAndRefresh(DataDict)} /> : <StarOff className="mr-3 size-8 cursor-pointer" onClick={() => toggleFavoriteAndRefresh(DataDict)} />}
							</div>
						</div>
						<div className={`w-full flex justify-center items-center ${getClassUI()}`}>
							<div className="my-2 w-[92%] border-[1px] border-neutral-700 rounded-full"></div>
						</div>
						<div className={`p-2 h-auto w-full text-black font-['Exo_2',_sans-serif] shrink-0 flex flex-col justify-center items-start rounded-b-[25px] ${getClassUI()}`}>
							<span className="ml-3">{lang == "vi" ? "Đồng nghĩa" : langDisplay?.text_synonymous}:</span>
							<ul className="ml-4">
								<li className="ml-6 list-disc">{Array.isArray(DataDict?.synonymous?.[lang]) ? DataDict.synonymous[lang].join(", ") : DataDict?.synonymous?.[lang]}</li>
							</ul>
							<span className="mt-2 ml-3">{lang == "vi" ? "Ví dụ" : langDisplay?.text_examples}:</span>
							<ul className="ml-4">
								{Array.isArray(DataDict?.example?.[lang]) ? (
									DataDict.example[lang].map((item, index) => (
										<li key={index} className="ml-6 list-disc">
											{item}
										</li>
									))
								) : (
									<li className="ml-6 list-disc">{DataDict?.example?.[lang]}</li>
								)}
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
