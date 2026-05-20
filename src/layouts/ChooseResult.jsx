import { useState } from "react"
import { BookA, SquareCode, ArrowDown } from "lucide-react"

import flagEN from "../assets/svg/flag-en.svg"
import flagLA from "../assets/svg/flag-la.svg"
import flagVI from "../assets/svg/flag-vi.svg"

function ChooseResult({ lang, langDisplay, hidden, run }) {
	const [DictType, setDictType] = useState(0)
	const [LangBegin, setLangBegin] = useState("en")
	const [LangTrans, setLangTrans] = useState("vi")
	const [CountGenerate, setCountGenerate] = useState(5)
	const languages = ["en", "vi", "la"]

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

	const handleChangeBegin = newLang => {
		setLangBegin(newLang)

		if (newLang === LangTrans) {
			const otherLang = languages.find(l => l !== newLang)
			setLangTrans(otherLang)
		}
	}

	const handleChangeTrans = newLang => {
		setLangTrans(newLang)

		if (newLang === LangBegin) {
			const otherLang = languages.find(l => l !== newLang)
			setLangBegin(otherLang)
		}
	}

	const handleGenerate = () => {
		run({
			dictType: DictType == 0 ? false : true,
			langBegin: LangBegin,
			langTrans: LangTrans,
			count: Number(CountGenerate),
		})
		hidden(false)
	}

	return (
		<>
			<style>
				{`
                .dict-selected {
					border: 3px solid #000000;
				}
                .lang-begin-selected {
					border: 3px solid #000000;
				}
				.lang-trans-selected {
					border: 3px solid #000000;
				}
			`}
			</style>

			<div id="choose-result" className="relative -mt-5 h-full w-full flex flex-col justify-center items-center">
				<div className="h-[80%] w-[80%] grid grid-cols-4 grid-rows-5 gap-2 text-black font-['Exo_2',_sans-serif]">
					<div onClick={() => setDictType(0)} className={`col-span-4 row-span-2 rounded-xl flex flex-col justify-center items-center ${getClassUI()}  ${DictType == 0 ? "dict-selected" : ""} cursor-pointer hover:border-[3px] hover:border-[#444444]`}>
						<BookA className="size-16" />
						<span className="mt-2 text-[18px] text-center">{lang == "vi" ? "Từ điển thông dụng" : langDisplay?.text_dict_0}</span>
					</div>
					{/* <div onClick={() => setDictType(1)} className={`col-span-2 row-span-2 col-start-3 rounded-xl flex flex-col justify-center items-center ${getClassUI()}  ${DictType == 1 ? "dict-selected" : ""} cursor-pointer hover:border-[3px] hover:border-[#444444]`}>
						<SquareCode className="size-16" />
						<span className="mt-2 text-xl text-center">{lang == "vi" ? "Từ điển chuyên ngành" : langDisplay?.text_dict_1}</span>
					</div> */}
					<div onClick={() => handleChangeBegin("en")} className={`row-start-3 rounded-xl flex justify-center items-center ${getClassUI()} ${LangBegin === "en" ? "lang-begin-selected" : ""} cursor-pointer hover:border-[3px] hover:border-[#444444]`}>
						<img src={flagEN} alt="English" width={40} />
					</div>
					<div onClick={() => handleChangeBegin("vi")} className={`row-start-3 rounded-xl flex justify-center items-center ${getClassUI()} ${LangBegin === "vi" ? "lang-begin-selected" : ""} cursor-pointer hover:border-[3px] hover:border-[#444444]`}>
						<img src={flagVI} alt="Vietnamese" width={40} />
					</div>
					<div onClick={() => handleChangeBegin("la")} className={`row-start-3 rounded-xl flex justify-center items-center ${getClassUI()} ${LangBegin === "la" ? "lang-begin-selected" : ""} cursor-pointer hover:border-[3px] hover:border-[#444444]`}>
						<img src={flagLA} alt="Laotian" width={40} />
					</div>
					<div className={`col-start-2 row-start-4 rounded-xl flex justify-center items-center ${getClassUI()}`}>
						<ArrowDown className="size-12" />
					</div>
					<div onClick={() => handleChangeTrans("en")} className={`col-start-1 row-start-5 rounded-xl flex justify-center items-center ${getClassUI()} ${LangTrans === "en" ? "lang-trans-selected" : ""} cursor-pointer hover:border-[3px] hover:border-[#444444]`}>
						<img src={flagEN} alt="English" width={40} />
					</div>
					<div onClick={() => handleChangeTrans("vi")} className={`col-start-2 row-start-5 rounded-xl flex justify-center items-center ${getClassUI()} ${LangTrans === "vi" ? "lang-trans-selected" : ""} cursor-pointer hover:border-[3px] hover:border-[#444444]`}>
						<img src={flagVI} alt="Vietnamese" width={40} />
					</div>
					<div onClick={() => handleChangeTrans("la")} className={`col-start-3 row-start-5 rounded-xl flex justify-center items-center ${getClassUI()} ${LangTrans === "la" ? "lang-trans-selected" : ""} cursor-pointer hover:border-[3px] hover:border-[#444444]`}>
						<img src={flagLA} alt="Laotian" width={40} />
					</div>
					<div className={`col-start-4 row-start-3 rounded-xl flex justify-center items-center ${getClassUI()}`}>
						<div className="flex items-center overflow-hidden">
							<button className="px-3 text-lg rounded-xl cursor-pointer hover:bg-[#eeeeee]" onClick={() => setCountGenerate(v => Math.max(4, v - 1))}>
								−
							</button>
							<input type="text" value={CountGenerate} onChange={e => setCountGenerate(+e.target.value)} className="w-full text-center outline-none appearance-none" />
							<button className="px-3 text-lg rounded-xl cursor-pointer hover:bg-[#eeeeee]" onClick={() => setCountGenerate(v => Math.min(30, v + 1))}>
								+
							</button>
						</div>
					</div>
					<div className={`row-span-2 col-start-4 row-start-4 rounded-xl flex justify-center items-center ${getClassUI()} cursor-pointer hover:border-[3px] hover:border-[#444444]`} onClick={() => handleGenerate()}>
						<span className="mt-2 text-[18px] font-bold">{lang == "vi" ? "TẠO" : langDisplay?.text_button}</span>
					</div>
				</div>
			</div>
		</>
	)
}

export default ChooseResult
