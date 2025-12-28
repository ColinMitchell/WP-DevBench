import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import JsonView from "@uiw/react-json-view";

interface ParamsPopoverProps {
	params: any;
	children?: React.ReactNode;
}

export function ParamsDataPopover({ params, children }: ParamsPopoverProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				{children || (
					<Button variant="ghost" size="sm" className="h-5 w-5 p-0">
						<Eye className="h-3 w-3" />
					</Button>
				)}
			</PopoverTrigger>
			<PopoverContent className="w-80" align="end">
				<div className="space-y-2">
					<h4 className="font-medium">Parameters</h4>
					<div className="max-h-60 overflow-y-auto">
						<JsonView
							value={params}
							collapsed={false}
							displayDataTypes={false}
							enableClipboard={false}
							style={{
								backgroundColor: "transparent",
								fontSize: "12px",
								fontFamily:
									'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
							}}
						/>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
