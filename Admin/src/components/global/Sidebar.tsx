import React from "react";
import { cn } from "@/lib/utils";
import SidebarNav from "@components/global/SidebarNav";
import {LayoutDashboard, PencilRuler, Rocket, ClipboardCheck, Earth} from 'lucide-react';

import {NavItem} from "@/types/types";
import {isAuthorized} from "@utils/authUtils";

export default function Sidebar() {

	const navItems: NavItem[] = [
		{
			title: "Overview",
			href: "/",
			icon: <LayoutDashboard size={48}  className="mr-2 h-4 w-4"/>,
			label: "Overview",
			description: "Gives you an overview of the site and quick tools.",
			roles: ["administrator"]
		},
		{
			title: "DevBench",
			href: "/devbench",
			icon: <Rocket size={48} className="mr-2 h-4 w-4"/>,
			label: "devbench",
			roles: ["administrator"]
		},
	];

	// Filter nav items based on the user's role
	const filteredNavItems = navItems.filter(item => isAuthorized(item.roles));

	return (
		<nav className={cn(`relative hidden border-r pt-5 lg:block w-64`)}>
			<div className="space-y-4 py-4">
				<div className="px-3 py-2">
					<div className="space-y-1">
						<SidebarNav items={filteredNavItems} />
					</div>
				</div>
			</div>
		</nav>
	)
}