import { useEffect, useState, useRef } from "react"
// import useTheme from "../utils/useTheme.js"
import { useNavigate } from "react-router-dom"

import { PywebviewAPI } from "../utils/pywebview-api.js"
import { Play, ChevronRight } from "lucide-react"

function Setting({ lang, onReady }) {
	const [LangDisplay, setLangDisplay] = useState(null)
	const [DataUser, setDataUser] = useState(null)
	const resetDictElement = useRef()
	// const { mode, setMode } = useTheme()
	// const handleTheme = () => {
	// 	setMode(mode == "dark" ? "light" : "dark")
	// }
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

	const resetDict = () => {
		resetDictElement.current.classList.toggle("top-21")

		const run = async () => {
			const api = await PywebviewAPI()
			if (!api || !api.SearchTree) return
			api.LoadTreeFromFile()
		}

		run()
		resetDictElement.current.innerHTML = `
			<span class="ml-1 text-black">${lang == "vi" ? "Đang nạp lại bộ dữ liệu" : LangDisplay?.text_reset_loading}</span>
			<div class="ml-3 h-5 w-5 animate-spin rounded-full border-b-2 border-current" />
		`

		setTimeout(() => {
			resetDictElement.current.innerHTML = `
				<span class="ml-1 text-black">${lang == "vi" ? "Đã nạp lại bộ dữ liệu thành công" : LangDisplay?.text_reset_confirm}</span>
				<div class="ml-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg></div>
			`
			setTimeout(() => {
				resetDictElement.current.classList.toggle("top-21")
			}, 2000)
		}, 3000)
	}

	useEffect(() => {
		onReady()
		if (lang != "vi") {
			fetch(`./lang/${lang}.json`)
				.then(res => res.json())
				.then(data => setLangDisplay(data.setting))
		}
		fetch("/data/user.json")
			.then(res => res.json())
			.then(data => setDataUser(data))
	}, [onReady, lang])

	return (
		<>
			<div id="setting" className="h-auto w-full flex flex-col justify-start items-center overflow-y-auto scrollbar-hide">
				<div id="setting-header" className="h-22 w-full flex justify-start items-center">
					<span className="ml-10 text-black text-[40px] font-['Exo_2',_sans-serif]">{lang == "vi" ? "Cài đặt" : LangDisplay?.text_setting}</span>
				</div>
				<div id="setting-user" className="relative h-auto w-full flex flex-col justify-center items-center">
					<div className="h-12 w-[85%] flex justify-start items-center">
						<span className="text-black text-[25px] font-['Exo_2',_sans-serif]">{lang == "vi" ? "Người dùng" : LangDisplay?.text_user}</span>
					</div>
					<div id="username" className={`relative z-10 h-16 w-[85%] flex flex-row justify-between items-center rounded-xl ${getClassUI()} cursor-pointer`}>
						<span className="ml-3 text-black text-[20px] font-['Exo_2',_sans-serif]">
							{lang == "vi" ? "Tên" : LangDisplay?.text_username}: {DataUser?.username}
						</span>
						<ChevronRight className="mr-3" />
					</div>
					<div id="favourite" className={`relative z-10 mt-3 h-16 w-[85%] flex flex-row justify-between items-center rounded-xl ${getClassUI()} cursor-pointer`} onClick={() => navigate("/favorite")}>
						<span className="ml-3 text-black text-[20px] font-['Exo_2',_sans-serif]">{lang == "vi" ? "Xem danh sách từ yêu thích" : LangDisplay?.text_favourite}</span>
						<ChevronRight className="mr-3" />
					</div>
				</div>
				<div id="setting-general" className="relative h-auto w-full flex flex-col justify-center items-center">
					<div className="h-12 w-[85%] flex justify-start items-center">
						<span className="text-black text-[25px] font-['Exo_2',_sans-serif]">{lang == "vi" ? "Dữ liệu" : LangDisplay?.text_data}</span>
					</div>
					<div id="data" className={`relative z-10 h-16 w-[85%] flex flex-row justify-between items-center rounded-xl ${getClassUI()} cursor-pointer`} onClick={() => resetDict()}>
						<span className="ml-3 text-black text-[20px] font-['Exo_2',_sans-serif]">{lang == "vi" ? "Nạp lại bộ dữ liệu các từ điển" : LangDisplay?.text_reset}</span>
						<Play className="mr-3" />
					</div>
					<div ref={resetDictElement} className={`absolute z-5 top-12 p-2 h-16 w-[85%] flex flex-row justify-start items-end rounded-xl bg-white/50 transition-all duration-300`}></div>
				</div>
				{/* <div id="setting-ui" className="h-auto w-full flex flex-col justify-center items-center">
					<div className="h-12 w-[85%] flex justify-start items-center">
						<span className="text-neutral-50 text-[25px] dark:text-neutral-950">Cá nhân hóa</span>
					</div>
					<div id="theme" className="h-16 w-[85%] flex flex-row justify-between items-center rounded-xl bg-neutral-800 dark:bg-neutral-200">
						<span className="ml-3 text-neutral-50 text-[20px] dark:text-neutral-950">Giao diện</span>
						<button type="button" role="switch" onClick={() => handleTheme()} className="relative mr-3 h-8 w-15 border-2 border-neutral-50 rounded-full cursor-pointer dark:border-neutral-950">
							<div className="absolute top-0.5 left-0.5 h-6 w-6 rounded-full transition-transform duration-300 translate-x-7 dark:translate-x-0">
								<span className="text-neutral-50 dark:text-neutral-950">
									<Sun className="size-6 hidden dark:block" />
									<Moon className="size-6 block dark:hidden" />
								</span>
							</div>
						</button>
					</div>
				</div> */}
				{/* <div id="setting-info" className="relative m-10 h-auto w-full flex flex-col justify-center items-center">
					<span className="text-[16px] font-['Exo_2',_sans-serif]">Từ điển Anh - Việt - Lào</span>
					<span className="text-[15x] font-['Exo_2',_sans-serif]">Phiên bản: 1.0.0</span>
				</div> */}
			</div>
		</>
	)
}
export default Setting
