
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
		<div className="flex-1 space-y-4 pt-6 pr-5 dark:bg-slate-950">
			{children}
		</div>
	);
};

export default Wrapper;
