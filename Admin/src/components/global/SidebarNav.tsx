import React from "react";
import {cn} from "@lib/utils";
import {NavLink} from "react-router-dom";

export default function SidebarNav(props: any) {
	return (
		<>
			<nav className="grid items-start gap-2">
				{props.items.map((item: any, index: any) => {
					return (
						item.href && (
							<NavLink
								key={index}
								to={item.href}
								className={({ isActive, isPending }) => {
									// Define the default classes
									const defaultClasses = " text-muted-foreground focus:outline-none focus:shadow-none rounded-md";

									// Use template literals to combine default and conditional classes
									return `${defaultClasses} ${
										isPending ? "pending" : isActive ? "bg-accent text-accent-foreground" : ""
									}`;
								}}
							>
								<span
								  className={cn(
									  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
									  item.disabled && "cursor-not-allowed opacity-80",
								  )}
								>
								  {item.icon}
								  <span>{item.title}</span>
							  </span>
							</NavLink>
						)
					);
				})}
			</nav>
		</>
	)
}