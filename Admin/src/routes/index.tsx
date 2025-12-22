import Header from "@components/global/Header";
import Sidebar from "@components/global/Sidebar";
import {HashRouter, Route, Routes, useLocation} from "react-router-dom";
import DevBench from "@pages/DevBench";
import {Toaster} from "@components/ui/toaster";
import React from "react";

import {isAuthorized} from "@utils/authUtils";
import {cn} from "@lib/utils";
import RouteBasedTitle from "@components/global/RouteBasedTitle";

export default function IndexRouter() {
	return (
		<HashRouter>
			<RouteBasedTitle />
			<InnerContent />
		</HashRouter>
	)
}

/**
 * Dev Note: I had to create this InnerContent to make the router useLocation() work within the HashRouter.
 * @constructor
 */
function InnerContent() {
	return (
		<div className="light pr-5" style={{colorScheme: 'light'}}>
			<Header/>
            <main className="w-full pt-0">
                <Routes>
                    {isAuthorized(['administrator']) && <Route path="/" element={<DevBench/>}/>}
                </Routes>
            </main>
			<Toaster/>
		</div>
	)
}
