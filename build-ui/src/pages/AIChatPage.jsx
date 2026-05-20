import { useEffect, useState, useRef } from "react"
// import { NavLink } from "react-router-dom"
// import { Search, X } from "lucide-react"

import { GoogleGenAI } from "@google/genai"

function AIChat({ lang, onReady }) {
	const [LangDisplay, setLangDisplay] = useState(null)
	const [Question, setQuestion] = useState(null)
	const outputRef = useRef(null)
	const notificationRef = useRef(null)
	const inputRef = useRef(null)
	const [ListSearch, setListSearch] = useState([])

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

	const getDataUser = async () => {
		const apiKey = localStorage.getItem("gemini-api-key-user")
		if (apiKey) return apiKey

		const res = await fetch("./data/user.json")
		const data = await res.json()
		return [data.gemini["api-key-free"], data.gemini["model"]]
	}

	const askGemini = async value => {
		const [apiKey, model] = await getDataUser()

		if (typeof apiKey !== "string" || !apiKey.startsWith("AIza")) {
			alert("Gemini API key không hợp lệ")
			return
		}

		const GenAI = new GoogleGenAI({ apiKey })

		const question = value
		if (!question) return

		notificationRef.current.innerText = lang == "vi" ? "Đang tra nghĩa bằng AI..." : LangDisplay?.notification_loading

		setQuestion(question.trim())

		const fullPrompt = `
			${customizePrompt(lang)}
			TỪ CẦN GIẢI NGHĨA:
			${question.trim()}
		`

		try {
			const response = await GenAI.models.generateContent({
				model: model ? model : "gemini-2.5-flash-lite",
				contents: fullPrompt,
			})

			const item = { question: question.trim(), output: response?.text || (lang == "vi" ? "Không có phản hồi từ AI, hãy thử nhập lại." : LangDisplay?.output_err_not_response) }
			setListSearch(prev => [...prev, item])

			inputRef.current.value = ""
			notificationRef.current.innerText = lang == "vi" ? "Nhập từ cần tìm (dạng: từ 1, từ 2, từ 3)" : LangDisplay?.notification
		} catch (err) {
			console.log("Lỗi khi gọi Gemini API:")
			console.log(err)

			const item = {
				question: question.trim(),
				output: lang == "vi" ? "Phản hổi từ AI có thể bị quá giới hạn trong ngày.\nVui lòng đổi API KEY khác nếu bạn đang sử dụng API KEY FREE để tránh việc bị sử dụng chung làm nhanh chóng hết giới hạn hằng ngày." : LangDisplay?.output_err_end,
			}
			setListSearch(prev => [...prev, item])

			inputRef.current.value = ""
			notificationRef.current.innerText = lang == "vi" ? "Nhập từ cần tìm (dạng: từ 1, từ 2, từ 3)" : LangDisplay?.notification
		}
	}

	const customizePrompt = lang => {
		const langDisplay = langInput => {
			switch (langInput) {
				case "en":
					return "Tiếng Anh"
				case "la":
					return "Tiếng Lào"
				case "vi":
					return "Tiếng Việt"
			}
		}

		const TRAINING_PROMPT_DICT = `
			Bạn là trợ lý học từ vựng cho sinh viên.

			NHIỆM VỤ:
			- Người dùng nhập MỘT TỪ HOẶC NHIỀU TỪ.
			- Giải nghĩa từ đó rõ ràng, dễ hiểu.

			BẮT BUỘC trả lời theo ĐÚNG định dạng sau (không thêm, không bớt):

			Từ: <giữ nguyên từ cần tra nghĩa vào đây>
			- Giải nghĩa: <giải nghĩa ngắn gọn, dễ hiểu>
			- Cách phát âm: <phiên âm đơn giản, không IPA>
			- Từ đồng nghĩa: <các từ đồng nghĩa, ngăn cách bằng dấu phẩy>
			- Câu ví dụ: <một câu ví dụ tự nhiên>
			- Cách dùng: <mô tả ngắn gọn cách dùng>

			QUY TẮC:
			- Trả lời bằng ${langDisplay(lang)} và cả tiêu đề như "Từ", "Giải nghĩa", "Cách phát âm", "Từ đồng nghĩa", "Câu ví dụ", "Cách dùng".
			- Không dùng emoji
			- Không giải thích ngoài các mục trên
			- Nếu từ không tồn tại, nói rõ ở mục Explain word

			⚠️ CỰC KỲ QUAN TRỌNG:
			- CHỈ trả về đúng 5 dòng theo mẫu.
			- KHÔNG thêm tiêu đề khác.
			- KHÔNG song ngữ.
			- KHÔNG xuống dòng thừa.
			- Nếu sai định dạng → tự sửa lại cho đúng rồi mới trả lời.
			- Khi chuyển sang ngôn ngữ Lào thường bị lỗi kết quả về, hãy kiểm tra kết quả nhiều lần nếu ngôn ngữ trả lời là tiếng Lào
			- KHÔNG THÊM BẤT CỨ GÌ NGOÀI CÁC ĐIỀU KIỆN Ở TRÊN
		`

		return TRAINING_PROMPT_DICT
	}

	useEffect(() => {
		onReady()
		if (lang != "vi") {
			fetch(`./lang/${lang}.json`)
				.then(res => res.json())
				.then(data => setLangDisplay(data["ai-chat"]))
		}
	}, [lang, onReady])

	useEffect(() => {
		if (!outputRef.current) return
		const lastItem = outputRef.current.lastElementChild
		lastItem?.scrollIntoView({ behavior: "smooth" })
	}, [ListSearch])

	return (
		<>
			<div id="ai-chat" className="h-auto w-full flex flex-col justify-start items-center">
				<div className="h-30 w-full flex flex-col justify-center items-center shadow-[0_0px_30px_rgba(255,255,255,0.25)]">
					<span className="text-black text-3xl font-['Exo_2',_sans-serif] dark:text-neutral-950">{lang == "vi" ? "Học cùng AI" : LangDisplay?.text_title}</span>
					<span className="mt-2 w-[85%] text-black text-[15px] font-['Exo_2',_sans-serif] text-center dark:text-neutral-950">
						{lang == "vi" ? "Học cùng AI giúp người học tra cứu từ điển nhanh chóng, chính xác và hiểu sâu hơn ngữ nghĩa của từ trong từng ngữ cảnh." : LangDisplay?.text_describe}
					</span>
				</div>
				<div id="ai-chat-output" className="h-[calc(100%-120px-120px-64px)] w-full flex flex-col justify-start items-center overflow-x-auto scrollbar-hide">
					<ul className="mt-3 h-auto w-full" ref={outputRef}>
						{ListSearch.map((item, index) => {
							console.log(item)
							return (
								<li key={`item-search-${index}`} className="relative mb-5">
									<div className="px-3 flex flex-col justify-center items-end">
										<div className={`px-5 py-2 ${getClassUI()} rounded-3xl`}>
											<span className="relative top-0 right-0 text-black text-[15px] font-['Exo_2',_sans-serif]">{item.question}</span>
										</div>
									</div>
									<div className="mt-2 px-3 w-[85%] max-w-[85%] flex flex-col justify-center items-start">
										<div className={`px-4 py-2 ${getClassUI()} rounded-3xl`}>
											<span className="text-black text-[15px] font-['Exo_2',_sans-serif] whitespace-pre-line">{item.output}</span>
										</div>
									</div>
								</li>
							)
						})}
					</ul>
				</div>
				<div className="h-30 w-full flex flex-row justify-center items-center shadow-[0_8px_30px_rgba(255,255,255,0.25)]">
					<div className="h-full w-[calc(100%-140px)] flex flex-col justify-end items-start">
						<span ref={notificationRef} className="ml-6 mb-3 text-black text-[18px] font-['Exo_2',_sans-serif]">
							{lang == "vi" ? "Nhập từ cần tìm (dạng: từ 1, từ 2, từ 3)" : LangDisplay?.notification}
						</span>
						<input
							type="text"
							ref={inputRef}
							onKeyDown={e => {
								if (e.key === "Enter") askGemini(inputRef.current.value)
							}}
							className={`ml-5 mb-4.5 py-3 px-4 w-[95%] text-black rounded-xl ${getClassUI()} placeholder:text-black placeholder:text-[16px] placeholder:font-['Exo_2',_sans-serif]`}
							placeholder={lang == "vi" ? "One, Two, Three,....." : LangDisplay?.input_placeholder}
						/>
					</div>
					<div className="h-full w-35 flex justify-center items-center">
						<button onClick={() => askGemini(inputRef.current.value)} className={`h-[70%] w-[70%] text-black text-xl rounded-xl font-['Exo_2',_sans-serif] transition-all cursor-pointer ${getClassUI()}`}>
							{lang == "vi" ? "Hỏi AI" : LangDisplay?.button_ask}
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default AIChat
