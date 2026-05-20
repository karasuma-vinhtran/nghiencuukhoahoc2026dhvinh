import { useEffect, useState } from "react"

export default function useThemeMode() {
	const getInitialMode = () => localStorage.getItem("theme") || "dark"
	const [mode, setMode] = useState(getInitialMode)

	useEffect(() => {
		const systemIsLight = !window.matchMedia("(prefers-color-scheme: dark)").matches
		const shouldAddDarkClass = mode === "light" || (mode === "system" && systemIsLight)

		document.documentElement.classList.toggle("dark", shouldAddDarkClass)
		localStorage.setItem("theme", mode)
		if (mode !== "system") return

		const media = window.matchMedia("(prefers-color-scheme: dark)")
		const handler = e => {
			document.documentElement.classList.toggle("dark", !e.matches)
		}

		media.addEventListener("change", handler)
		return () => media.removeEventListener("change", handler)
	}, [mode])
	return { mode, setMode }
}
