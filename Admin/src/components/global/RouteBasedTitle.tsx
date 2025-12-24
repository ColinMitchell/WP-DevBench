import React from "react";
import {useEffect} from "react";
import {useLocation} from "react-router-dom";

export default function RouteBasedTitle() {
	const routerLocation = useLocation();

	const suffix = `- WordPress`;

	useEffect(() => {
		// Define titles for each route
		const routeTitles: { [key: string]: string } = {
			'/': `WP DevBench ${suffix}`,
		};

		// Set document title based on current route
		document.title = routeTitles[routerLocation.pathname] || `DevBench ${suffix}`;

	}, [routerLocation.pathname]);

	return (
		<>
		</>
	)
}
