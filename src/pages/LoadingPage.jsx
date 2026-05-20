import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Loading from "../components/Loading.jsx"

function LoadingPage({ onReady }) {
	const [IsStart, setIsStart] = useState(false)
	const navigate = useNavigate()

	const handleReady = () => {
		setIsStart(true)
		setTimeout(() => {
			onReady()
			navigate("/home")
		}, 3000)
	}

	return (
		<div
			id="loading"
			className="relative h-screen w-full flex flex-col justify-center items-center text-black cursor-pointer"
			onClick={() => {
				handleReady()
			}}
		>
			{!IsStart ? (
				<>
					<span className="text-4xl font-['Exo_2',_sans-serif]">Từ điển Việt - Anh - Lào</span>
					<span className="mt-5 text-xl">Nhấp vào màn hình để khởi chạy!</span>
				</>
			) : (
				<>
					<span className="text-xl">Đang tải dữ liệu từ điển và model giọng nói...</span>
					<div className="relative mt-5 h-10 w-10 flex justify-center items-center">
						<Loading />
					</div>
				</>
			)}
		</div>
	)
}

export default LoadingPage
