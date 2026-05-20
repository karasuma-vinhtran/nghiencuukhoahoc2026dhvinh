import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
	plugins: [react(), tailwindcss()],
	base: "./",
	build: {
		chunkSizeWarningLimit: 1000, // tăng lên 1000kB (1MB)
	},
})
