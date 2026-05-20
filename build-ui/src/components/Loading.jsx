import "./Loading.css"

function Loading({ hidden }) {
	return (
		<>
			<div id="loading" className={`absolute h-full w-full flex justify-center items-center ${hidden ? "-z-1 opacity-0" : "z-5"} transition-all duration-500`}>
				<span className="loader"></span>
			</div>
		</>
	)
}

export default Loading
