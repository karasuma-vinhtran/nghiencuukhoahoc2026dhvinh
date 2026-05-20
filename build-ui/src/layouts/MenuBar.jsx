// import { useEffect, useState, useRef } from "react"
import { NavLink } from "react-router-dom"
import { House, BookA, SquareCode, Bot, Settings } from "lucide-react"

function MenuBar({ lang }) {
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

	return (
		<>
			<div id="menu-bar" className={`fixed z-10 bottom-0 left-0 right-0 h-16 flex flex-row ${getClassUI()}`}>
				<div id="menu-dict" className="h-full w-1/5 flex justify-center items-center text-neutral-900 font-exo_2">
					<NavLink to="/dict" className={({ isActive }) => `h-10 w-1/2 flex justify-center items-center ${isActive ? "selected-menubar" : ""} rounded-[8px] transition-all duration-200 hover:bg-[#00000033]`}>
						<BookA className="size-6" />
					</NavLink>
				</div>
				<div id="menu-it" className="h-full w-1/5 flex justify-center items-center text-neutral-900 font-exo_2">
					<NavLink to="/it" className={({ isActive }) => `h-10 w-1/2 flex justify-center items-center ${isActive ? "selected-menubar" : ""} rounded-[8px] transition-all duration-200 hover:bg-[#00000033]`}>
						<SquareCode className="size-6" />
					</NavLink>
				</div>
				<div id="menu-home" className="relative h-full w-1/5 flex justify-center items-center text-neutral-900 font-exo_2">
					<NavLink to="/home" id="menu-home-circle" className={({ isActive }) => `h-10 w-1/2 flex justify-center items-center ${isActive ? "selected-menubar" : ""} rounded-[8px] transition-all duration-200 hover:bg-[#00000033]`}>
						<House className="size-6" />
					</NavLink>
				</div>
				<div id="menu-ai-chat" className="h-full w-1/5 flex justify-center items-center text-neutral-900 font-exo_2">
					<NavLink to="/ai-chat" className={({ isActive }) => `h-10 w-1/2 flex justify-center items-center ${isActive ? "selected-menubar" : ""} rounded-[8px] transition-all duration-200 hover:bg-[#00000033]`}>
						<Bot className="size-6" />
					</NavLink>
				</div>
				<div id="menu-setting" className="h-full w-1/5 flex justify-center items-center text-neutral-900 font-exo_2">
					<NavLink to="/setting" className={({ isActive }) => `h-10 w-1/2 flex justify-center items-center ${isActive ? "selected-menubar" : ""} rounded-[8px] transition-all duration-200 hover:bg-[#00000033]`}>
						<Settings className="size-6" />
					</NavLink>
				</div>
			</div>
		</>
	)
}

export default MenuBar
