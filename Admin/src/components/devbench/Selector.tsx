import React from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Button} from "@components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@components/ui/command";
import {ArrowUpDown, Loader2} from "lucide-react";
import {FuncInterface} from "@/types/types";

export interface selectorProps {
	functions: FuncInterface[]|null;
	selectedFunction: FuncInterface|null;
	setSelectedFunction: (item: FuncInterface|null) => void;
	onClearResults?: () => void;
}

export default function Selector({functions, selectedFunction, setSelectedFunction, onClearResults} : selectorProps) {
	const [open, setOpen] = React.useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-label="Load a hook..."
					aria-expanded={open}
					className="flex-1 justify-between lg:max-w-[600px] dark:bg-slate-700 dark:border-slate-600 dark:text-white"
				>
					{selectedFunction ? `${selectedFunction.source}->${selectedFunction.funcName}()` : "Load a function..."}
					<ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[600px] p-0 dark:bg-slate-800 dark:border-slate-600">
				<Command>
					<CommandInput
						placeholder="Type to search..."
						className="dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
						disabled={functions === null}
					/>
					<CommandList className="dark:bg-slate-800">
						{functions === null ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-5 w-5 animate-spin text-slate-500 dark:text-slate-400 mr-2" />
								<span className="text-sm text-slate-600 dark:text-slate-300">Loading functions...</span>
							</div>
						) : functions.length === 0 ? (
							<CommandEmpty className="dark:text-slate-400">No Functions found. See 'Docs' for how to use.</CommandEmpty>
						) : (
							<CommandGroup heading="Functions" className="dark:text-slate-300">
								{functions.map((item, index) => (
									<CommandItem
										key={index}
										onSelect={() => {
											setSelectedFunction(item)
											onClearResults?.()
											setOpen(false)
										}}
										value={item.funcName}
										className="dark:text-white dark:hover:bg-slate-700 dark:focus:bg-slate-700 dark:aria-selected:bg-slate-600"
									>
										{item.source}-&gt;{item.funcName}()
									</CommandItem>
								))}
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
