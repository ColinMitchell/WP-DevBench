import React from "react";
import { ThemeToggle } from "@components/global/ThemeToggle";

export default function Header() {
	return (
		<div className="supports-backdrop-blur:bg-background/60 border-slate-200 backdrop-blur dark:border-slate-800 dark:bg-slate-900">
			<nav className="flex h-14 items-center px-4 py-10">
				<div className="flex items-center gap-2">
					<h1 className="-mt-1 text-2xl font-bold dark:text-slate-100">DEV BENCH</h1>
					<ThemeToggle />
				</div>
			</nav>
		</div>
	);
}
