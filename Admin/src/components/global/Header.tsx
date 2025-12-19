import React from "react";

export default function Header() {
	return (
		<div className="supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur">
			<nav className="h-14 flex items-center px-4 py-10">
				<h1 className="text-2xl font-bold -mt-1">DEV BENCH</h1>
				{/*<div className={cn("block lg:!hidden")}>
					<MobileSidebar/>
				</div>*/}

				{/*<div className="flex items-center gap-2">
					<ThemeToggle/>
				</div>*/}
			</nav>
		</div>
	)
}