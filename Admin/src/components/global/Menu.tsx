import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger} from "@/components/ui/menubar";
import React from "react";

export default function Menu() {
	return (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>File</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						New Tab <MenubarShortcut>⌘T</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>New Window</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>Share</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>Print</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	)
}