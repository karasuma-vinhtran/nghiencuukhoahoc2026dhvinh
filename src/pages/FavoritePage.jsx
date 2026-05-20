import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Volume2, Star, StarOff } from "lucide-react"

import { PywebviewAPI } from "../utils/pywebview-api.js"

function Favorite({ lang, onReady }) {
	const [DataDictArray, setDataDictArray] = useState(() => {
		const data = localStorage.getItem("favorites")
		return data ? JSON.parse(data) : []
	})
	const [Refresh, setRefresh] = useState(false)
	const [LangDisplay, setLangDisplay] = useState(null)
	const [TranslateLang, setTranslateLang] = useState(lang == "en" ? "vi" : "en")
	const navigate = useNavigate()

	const langList = ["en", "vi", "la"]
	const langListCurrent = [...langList]
	if (lang == "vi") langListCurrent.splice(1, 1)
	if (lang == "en") langListCurrent.splice(0, 1)
	if (lang == "la") langListCurrent.splice(2, 1)

	const handleChangeLangType = e => {
		setTranslateLang(e.currentTarget.dataset.langType)
	}

	const Speak = async text => {
		const api = await PywebviewAPI()
		if (!api || !api.Speak) return
		api.Speak(text, LangDisplay)
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
		location.reload()
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
			<div id="favourite" className="relative h-screen w-full flex flex-col justify-start items-center text-black">
				<div id="favourite-header" className="relative h-20 w-full flex justify-center items-center">
					<ArrowLeft className="absolute left-5 size-10 text-black cursor-pointer" onClick={() => navigate("/home")} />
					<span className="text-black text-[35px] font-['Exo_2',_sans-serif]">{lang == "vi" ? "Yêu thích" : LangDisplay?.title_favorite}</span>
				</div>
				<div id="favourite-type" className="relative mt-2 h-[60px] w-full flex justify-center items-start">
					<div className={`p-2 h-full w-[90%] rounded-full flex gap-3 justify-center items-center ${getClassUI()}`}>
						<div className={`h-full w-1/2 rounded-full flex justify-center items-center ${TranslateLang === `${langListCurrent[0]}` ? "selected-type" : ""}`}>
							<span data-lang-type={langListCurrent[0]} onClick={handleChangeLangType} className="text-black text-[18px] cursor-pointer">
								{lang == "vi" ? "Anh" : LangDisplay?.type_result[0]}
							</span>
						</div>
						<div className={`h-full w-1/2 rounded-full flex justify-center items-center ${TranslateLang === `${langListCurrent[1]}` ? "selected-type" : ""}`}>
							<span data-lang-type={langListCurrent[1]} onClick={handleChangeLangType} className="text-black text-[18px] cursor-pointer">
								{lang == "vi" ? "Lào" : LangDisplay?.type_result[1]}
							</span>
						</div>
					</div>
				</div>
				<div id="favorite-list" className="mt-5 flex-1 w-full flex flex-col items-center overflow-y-auto scrollbar-hide">
					{DataDictArray.map((DataDict, index) => {
						console.log(DataDict)
						return (
							<div key={index} className="w-[90%] flex flex-col items-center mb-4">
								<div className={`p-2 h-auto w-full text-black font-['Exo_2',_sans-serif] shrink-0 flex flex-row justify-center items-center rounded-t-[25px] ${getClassUI()}`}>
									<div className="w-1/2 flex flex-col justify-center items-start">
										<span className="ml-3 text-3xl">
											{DataDict?.[lang]} - {DataDict?.[TranslateLang]}
										</span>
										<span className="ml-3">
											{lang == "vi" ? "Phát âm" : LangDisplay?.text_pronounce}: {DataDict?.pronounce?.[TranslateLang]}
										</span>
									</div>
									<div className="w-1/2 flex flex-row justify-end items-center">
										<Volume2 className="mr-3 size-8 cursor-pointer" onClick={() => Speak(DataDict?.[TranslateLang])} />
										{isFavorite(DataDict) ? <Star className="mr-3 size-8 cursor-pointer" onClick={() => toggleFavoriteAndRefresh(DataDict)} /> : <StarOff className="mr-3 size-8 cursor-pointer" onClick={() => toggleFavoriteAndRefresh(DataDict)} />}
									</div>
								</div>
								<div className={`w-full flex justify-center items-center ${getClassUI()}`}>
									<div className="my-2 w-[92%] border-[1px] border-neutral-700 rounded-full"></div>
								</div>
								<div className={`p-2 h-auto w-full text-black font-['Exo_2',_sans-serif] shrink-0 flex flex-col justify-center items-start rounded-b-[25px] ${getClassUI()}`}>
									<span className="ml-3">{lang == "vi" ? "Đồng nghĩa" : LangDisplay?.text_synonymous}:</span>
									<ul className="ml-4">
										{(Array.isArray(DataDict?.synonymous?.[TranslateLang]) ? DataDict.synonymous[TranslateLang] : [DataDict?.synonymous?.[TranslateLang]]).map((item, i) => (
											<li key={i} className="ml-6 list-disc">
												{item}
											</li>
										))}
									</ul>
									<span className="mt-2 ml-3">{lang == "vi" ? "Ví dụ" : LangDisplay?.text_examples}:</span>
									<ul className="ml-4">
										{(Array.isArray(DataDict?.example?.[TranslateLang]) ? DataDict.example[TranslateLang] : [DataDict?.example?.[TranslateLang]]).map((item, i) => (
											<li key={i} className="ml-6 list-disc">
												{item}
											</li>
										))}
									</ul>
									<span className="mt-2 ml-3">
										{lang == "vi" ? "Cách dùng" : LangDisplay?.text_usage}: {DataDict?.usage?.[TranslateLang]}
									</span>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</>
	)
}

export default Favorite
