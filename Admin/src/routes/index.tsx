import { HashRouter, Route, Routes } from "react-router-dom";
import DevBench from "@pages/DevBench";
import { Toaster } from "@components/ui/toaster";
import React from "react";

import { isAuthorized } from "@utils/authUtils";
import RouteBasedTitle from "@components/global/RouteBasedTitle";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

export default function IndexRouter() {
	return (
		<ThemeProvider>
			<HashRouter>
				<RouteBasedTitle />
				<InnerContent />
			</HashRouter>
		</ThemeProvider>
	);
}

/**
 * Dev Note: I had to create this InnerContent to make the router useLocation() work within the HashRouter.
 * @class
 */
function InnerContent() {
	const { isDark } = useTheme();

	return (
		<div className={isDark ? "dark" : "light"} style={{ colorScheme: isDark ? "dark" : "light" }}>
			{/*<Header/>*/}
			<main className="w-full pt-0">
				<Routes>{isAuthorized(["administrator"]) && <Route path="/" element={<DevBench />} />}</Routes>
			</main>
			<Toaster />
		</div>
	);
}
