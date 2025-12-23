import React from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Button} from "@components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@components/ui/command";
import {ArrowUpDown} from "lucide-react";
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
					className="flex-1 justify-between lg:max-w-[600px]"
				>
					{selectedFunction ? `${selectedFunction.class}->${selectedFunction.funcName}()` : "Load a function..."}
					<ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[600px] p-0">
				<Command>
					<CommandInput placeholder="Type to search..."/>
					<CommandList>
						{functions ? (
							<CommandGroup heading="Functions">
								{functions.map((item, index) => (
									<CommandItem
										key={index}
										onSelect={() => {
											setSelectedFunction(item)
											onClearResults?.()
											setOpen(false)
										}}
										value={item.funcName}
									>
										{item.class}-&gt;{item.funcName}()
									</CommandItem>
								))}
							</CommandGroup>
						) : (
							<CommandEmpty>No Functions found.</CommandEmpty>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
) }
