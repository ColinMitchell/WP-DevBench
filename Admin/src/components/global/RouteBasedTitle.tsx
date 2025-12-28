import React, { useEffect } from "react";

import { useLocation } from "react-router-dom";

export default function RouteBasedTitle() {
	const routerLocation = useLocation();

	useEffect(() => {
		const suffix = `- WordPress`;

		// Define titles for each route
		const routeTitles: { [key: string]: string } = {
			"/": `WP DevBench ${suffix}`,
		};

		// Set document title based on current route
		document.title = routeTitles[routerLocation.pathname] || `DevBench ${suffix}`;
	}, [routerLocation.pathname]);

	return <></>;
}
