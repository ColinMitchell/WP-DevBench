import React, { createContext, useContext, useEffect, useState } from "react";
import { storage } from "@utils/storage";

interface ThemeContextType {
	isDark: boolean;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [isDark, setIsDark] = useState(false);

	// Initialize from localStorage on mount
	useEffect(() => {
		const stored = storage.getItem("theme");
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

		if (stored !== null) {
			setIsDark(stored === "dark");
		} else {
			setIsDark(prefersDark);
		}
	}, []);

	// Apply theme to the root container (scoped to wp-devbench)
	useEffect(() => {
		const container = document.getElementById("wp-devbench-dashboard");
		if (container) {
			if (isDark) {
				container.classList.add("dark");
			} else {
				container.classList.remove("dark");
			}
		}
	}, [isDark]);

	const toggleTheme = () => {
		const newValue = !isDark;
		setIsDark(newValue);
		storage.setItem("theme", newValue ? "dark" : "light");
	};

	return <ThemeContext.Provider value={{ isDark, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within ThemeProvider");
	}
	return context;
}
