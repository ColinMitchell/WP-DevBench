
import React, { type ReactNode } from "react";
import {ScrollArea} from "@components/ui/scroll-area";
import {cn} from "@lib/utils";

interface WrapperProps {
	title: string;
	children: ReactNode;
	className?: string;
}

const Wrapper = ({ title, children, className }: WrapperProps) => {
	return (
		<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
			<div className="flex items-center justify-between space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">
					{title}
				</h2>
			</div>
			{children}
		</div>
	);
};

export default Wrapper;
