import React, {type ReactNode} from 'react';

interface WrapperProps {
	title: string;
	children: ReactNode;
	className?: string;
}

const Wrapper = ({ title, children, className }: WrapperProps) => {
	return (
		<div className="flex-1 space-y-4 pr-5 pt-6 dark:bg-slate-950">
			{children}
		</div>
	);
};

export default Wrapper;
