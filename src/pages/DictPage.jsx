import { useEffect, useState, useRef } from "react"
import { Search, X } from "lucide-react"

import Loading from "../components/Loading.jsx"
import HomeResult from "../layouts/HomeResult.jsx"

import flagEN from "../assets/svg/flag-en.svg"
import flagLA from "../assets/svg/flag-la.svg"
import flagVI from "../assets/svg/flag-vi.svg"

function Home({ lang, changeLang, onReady }) {
	const [LangDisplay, setLangDisplay] = useState(null)
	const [TranslateLang, setTranslateLang] = useState(lang == "en" ? "vi" : "en")
	const [HiddenLoading, setHiddenLoading] = useState(false)
	const [ShowResult, setShowResult] = useState(false)
	const [TextSearch, setTextSearch] = useState("")
	const SearchInput = useRef(null)

	const langList = ["en", "vi", "la"]
	const langListCurrent = [...langList]
	if (lang == "vi") langListCurrent.splice(1, 1)
	if (lang == "en") langListCurrent.splice(0, 1)
	if (lang == "la") langListCurrent.splice(2, 1)

	const handleChangeLang = newLang => {
		changeLang(newLang)
		if (newLang == "vi") langList.splice(1, 1)
		if (newLang == "en") langList.splice(0, 1)
		if (newLang == "la") langList.splice(2, 1)
		setTranslateLang(langList[0])

		SearchInput.current.value = ""
		setTextSearch("")
		setHiddenLoading(false)
		setShowResult(false)
		setTimeout(() => setHiddenLoading(true), 1000)
	}

	const handleChangeLangType = e => {
		setTranslateLang(e.currentTarget.dataset.langType)
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

	useEffect(() => {
		onReady()
		if (lang != "vi") {
			fetch(`./lang/${lang}.json`)
				.then(res => res.json())
				.then(data => setLangDisplay(data.home))
		}

		setTimeout(() => setHiddenLoading(true), 1000)
	}, [lang, onReady])

	return (
		<>
			<div id="home" className="h-auto w-full flex flex-col justify-start items-center">
				<div id="home-header" className="h-14 w-full flex flex-row">
					<div id="searchbar" className="h-full w-3/4 flex flex-row justify-center items-center transition-all duration-500 sm:w-[calc(100%-140px)]">
						<div className={`ml-3 h-10 w-full text-black flex flex-row rounded-full ${getClassUI()}`}>
							<Search className="mt-2.5 ml-2 mr-1 h-5 text-black flex justify-center items-center" />
							<input
								id="search-input"
								ref={SearchInput}
								onChange={e => {
									setTextSearch(e.target.value)
									setShowResult(e.target.value != "")
								}}
								className="ml-1 w-full bg-transparent placeholder:text-black placeholder:font-['Exo_2',_sans-serif]"
								type="text"
								placeholder={lang == "vi" ? "Nhập từ khóa tìm kiếm....." : LangDisplay?.search_placeholder}
								autoComplete="off"
							/>
							<X id="search-delete" className="hidden mt-2 ml-1 mr-2 h-6 text-white justify-center items-center" />
						</div>
					</div>
					<div id="languageBar" className="h-full w-1/4 flex flex-row justify-center items-center transition-all duration-500 sm:w-[140px]">
						<div className={`ml-2 mr-3 p-2 h-10 w-full flex flex-row rounded-full ${getClassUI()}`}>
							<div className="-mt-0.75 w-full text-white font-['Exo_2',_sans-serif] grid grid-cols-[repeat(3,1fr)] grid-rows-[1fr] gap-1.25 justify-center items-center">
								<div onClick={() => handleChangeLang("en")} className={`w-full text-[white] aspect-square rounded-full flex justify-center items-center transition-all duration-500 cursor-pointer ${lang === "en" ? "selected-lang" : ""} hover:bg-neutral-100`}>
									<img src={flagEN} alt="English" width={20} />
								</div>
								<div onClick={() => handleChangeLang("vi")} className={`w-full text-[white] aspect-square rounded-full flex justify-center items-center transition-all duration-500 cursor-pointer ${lang === "vi" ? "selected-lang" : ""} hover:bg-neutral-100`}>
									<img src={flagVI} alt="Vietnamese" width={20} />
								</div>
								<div onClick={() => handleChangeLang("la")} className={`w-full text-[white] aspect-square rounded-full flex justify-center items-center transition-all duration-500 cursor-pointer ${lang === "la" ? "selected-lang" : ""} hover:bg-neutral-100`}>
									<img src={flagLA} alt="Laotian" width={20} />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="home-type" className="relative mt-2 h-[60px] w-full flex justify-center items-start">
					<div className={`p-2 h-full w-[calc(100%-25px)] rounded-full flex gap-3 justify-center items-center ${getClassUI()}`}>
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
				<div id="home-display" className="relative mt-4 h-[calc(100%-56px-64px)] w-full flex justify-center items-start">
					<div className="relative h-full w-[calc(100%-25px)] overflow-y-auto scrollbar-hide">
						<div className={`absolute h-50 w-full flex justify-center items-center rounded-[25px] ${HiddenLoading ? "-z-1 opacity-0" : "z-5"} transition-all duration-500 ${getClassUI()}`}>
							<Loading />
						</div>
						<div className={`absolute h-50 w-full flex justify-center items-center rounded-[25px] ${HiddenLoading ? "z-5 opacity-100" : "-z-1 opacity-0"} transition-all duration-500 ${getClassUI()}`}>
							<span className="text-black font-['Exo_2',_sans-serif] text-2xl">{lang == "vi" ? "Hãy nhập từ khóa để tìm kiếm." : LangDisplay?.notification}</span>
						</div>
						<HomeResult lang={lang} langTrans={TranslateLang} langDisplay={LangDisplay} text={TextSearch.toLowerCase()} hidden={ShowResult} />
					</div>
				</div>
			</div>
		</>
	)
}

export default Home
