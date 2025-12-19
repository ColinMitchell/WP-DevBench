import React, {useMemo} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Button} from "@components/ui/button";
import {Input} from "@components/ui/input";
import Form from '@rjsf/core';
import {RJSFSchema, UiSchema, WidgetProps} from '@rjsf/utils';
import {noValidator} from "@utils/noValidator";
import {Checkbox} from "@components/ui/checkbox";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@components/ui/select";
import {FuncInterface} from "@/types/types";
import {FormItem} from "@components/ui/form";
import {CircleEllipsis} from "lucide-react";
import {cn} from "@lib/utils"

export interface selectorProps {
	selectedFunction: FuncInterface;
	paramData: any[];
	updateParams: (data:any) => void
}

export default function paramsPopover ({selectedFunction, paramData, updateParams}:selectorProps) {

	const schema: RJSFSchema = selectedFunction.params!;

	const uiSchema: UiSchema = {
		'ui:globalOptions': {
			label: false // Disables the labels for form fields
		},
		'ui:submitButtonOptions': {
			props: {
				disabled: false, // Disables the submit button since we use onChange
			},
			norender: true,
		},
	};

	/**
	 * Create custom widgets to override default react-jsonschema-forms inputs for ShadCN UI
	 */
	const widgets = useMemo(
		() => ({
			CheckboxWidget: function (props: WidgetProps) {
				return (
					<div className="flex items-center space-x-2 mb-4">
						<Checkbox checked={props.value} onCheckedChange={props.onChange}  value={props.value} id={props.id}/>
						<label htmlFor={props.id} className="text-sm font-medium leading-none">{props.label}</label>
					</div>
				)
			},
			TextWidget: function (props: WidgetProps) {
				return (
					<FormItem className="mb-4">
						<label htmlFor={props.id} className="text-sm font-medium leading-none">{props.label}</label>
						<Input onChange={e => props.onChange(e.target.value)} value={props.value} id={props.id}/>
					</FormItem>
				);
			},
			SelectWidget: function (props: WidgetProps) {
				const options = props.options?.enumOptions || [];

				return (
					<FormItem className="mb-4">
						<label className="text-sm font-medium">{props.label}</label>
						<Select onValueChange={props.onChange} value={props.value}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select an option" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{/*<SelectLabel>Options</SelectLabel>*/}
									{options.map((option: any, index: number) => (
										<SelectItem key={index} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</FormItem>
				);
			}
		}),
		[]
	);

	return (
		<>
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outline"
							size="icon"
							className={cn(
								"hover:bg-green-100 active:bg-green-100",
								{ "bg-green-200": paramData && Object.keys(paramData).length > 0 } // Shows as green if data is filled in
							)}
					>
						<CircleEllipsis height={18} width={18} className="" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80">
					<div className="grid gap-4">
						<div className="space-y-2">
							<h4 className="font-medium leading-none">Sandbox Function Params</h4>
						</div>
						<div className="grid gap-2">
							<Form
								schema={schema}
								validator={noValidator}
								onChange={(e) => updateParams(e.formData)}
								uiSchema={uiSchema}
								widgets={widgets}
								formData={paramData}
							/>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</>
	)
}