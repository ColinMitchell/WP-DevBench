import React from "react";
import {NavLink} from "react-router-dom";
import {cn} from "@lib/utils";
import {NavItem} from "@/types/types";

export interface navigationProps {
	items: NavItem[];
}

export default function SubMenu({items}: navigationProps) {
	return (
		<nav className="inline-flex flex-none items-center justify-center rounded-md bg-muted text-muted-foreground">
			{items.map((item: any, index: any) => {
				return (
					item.href && (
						<div
							key={index}
							className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
							<NavLink

								to={item.href}
								className={({isActive, isPending}) => {
									// Define the default classes
									const defaultClasses = " focus:outline-none focus:shadow-none rounded-md";

									// Use template literals to combine default and conditional classes
									return `${defaultClasses} ${
										isPending ? "pending" : isActive ? "bg-background text-accent-foreground" : "text-muted-foreground "
									}`;
								}}
								end // The end prop changes the matching logic for the active and pending states to only match to the "end" of the NavLink's to path.
							>
								<span
									className={cn(
										"group flex items-center px-3 py-2 text-sm font-medium hover:text-accent-foreground",
										item.disabled && "cursor-not-allowed opacity-80",
									)}
								>
								  {item.icon}
									<span>{item.title}</span>
							  </span>
							</NavLink>
						</div>
					)
				);
			})}
		</nav>
	)
}