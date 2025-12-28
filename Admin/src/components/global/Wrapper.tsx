import React, { type ReactNode } from "react";

interface WrapperProps {
	children: ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
	return <div className="flex-1 space-y-4 pr-5 pt-6 dark:bg-slate-950">{children}</div>;
};

export default Wrapper;
