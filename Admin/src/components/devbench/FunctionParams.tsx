import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormItem } from "@/components/ui/form";
import { ChevronDown, ChevronUp, Settings, AlertCircle } from "lucide-react";
import { FuncInterface } from "@/types/types";
import { cn } from "@/lib/utils";
import Form from "@rjsf/core";
import { RJSFSchema, UiSchema, WidgetProps } from "@rjsf/utils";
import { noValidator } from "@/utils/noValidator";
import { useToast } from "@/components/ui/use-toast";
import { validateFiles } from "@utils/fileValidator";

interface FunctionParamsProps {
	selectedFunction: FuncInterface | null;
	paramData: any;
	updateParams: (data: any) => void;
	loading: boolean;
	disabled?: boolean;
}

export default function FunctionParams({
	selectedFunction,
	paramData,
	updateParams,
	disabled = false,
}: FunctionParamsProps) {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [formData, setFormData] = useState<any>({});
	const { toast } = useToast();

	const hasParamData = formData && Object.keys(formData).length > 0;

	// Update form data when paramData changes (e.g., from history rerun)
	useEffect(() => {
		if (paramData && typeof paramData === "object") {
			setFormData(paramData);
		}
	}, [paramData]);

	// Create custom widgets for the parameter form
	const widgets = useMemo(
		() => ({
			CheckboxWidget(props: WidgetProps) {
				return (
					<div className="mb-4 flex items-center space-x-2">
						<Checkbox
							checked={props.value || false}
							onCheckedChange={(checked) => props.onChange(checked)}
							id={props.id}
							className="dark:border-slate-600 dark:bg-slate-700"
						/>
						<label htmlFor={props.id} className="text-sm font-medium leading-none dark:text-white">
							{props.label}
						</label>
					</div>
				);
			},
			TextWidget(props: WidgetProps) {
				return (
					<FormItem className="mb-4">
						<label htmlFor={props.id} className="text-sm font-medium leading-none">
							{props.label}
						</label>
						<Input
							onChange={(e) => props.onChange(e.target.value)}
							value={props.value || ""}
							id={props.id}
							className="dark:border-slate-600 dark:bg-slate-700 dark:text-white"
						/>
					</FormItem>
				);
			},
			SelectWidget(props: WidgetProps) {
				const options = props.options?.enumOptions || [];
				const id = `select-${props.id}`;

				return (
					<FormItem className="mb-4">
						<label htmlFor={id} className="text-sm font-medium">
							{props.label}
						</label>
						<Select onValueChange={props.onChange} value={props.value || ""}>
							<SelectTrigger
								id={id}
								className="w-full dark:border-slate-600 dark:bg-slate-700 dark:text-white"
							>
								<SelectValue placeholder="Select an option" />
							</SelectTrigger>
							<SelectContent className="dark:border-slate-600 dark:bg-slate-700">
								<SelectGroup>
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
			},
		}),
		[]
	);

	const schema: RJSFSchema | null = selectedFunction?.params || null;

	const uiSchema: UiSchema = {
		"ui:globalOptions": {
			label: false,
		},
		"ui:submitButtonOptions": {
			props: {
				disabled: false,
			},
			norender: true,
		},
	};

	const handleFormChange = (e: any) => {
		// Validate files before updating state
		const validationResult = validateFiles(e.formData, schema);

		if (!validationResult.valid) {
			// Show error toast
			toast({
				title: "File Upload Error",
				description: (
					<div className="flex flex-col gap-1">
						{validationResult.errors.map((err, idx) => (
							<span key={idx} className="flex items-center">
								<AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
								{err.message}
							</span>
						))}
					</div>
				),
				variant: "destructive",
				duration: 5000,
			});

			// Reset the file field to remove the filename display
			// Find the key that contains the invalid file
			const updatedFormData = { ...formData };
			Object.keys(e.formData).forEach((key) => {
				const value = e.formData[key];
				if (typeof value === "string" && value.startsWith("data:")) {
					// Keep the old value (or empty string if none exists)
					if (!formData[key] || !formData[key].startsWith("data:")) {
						updatedFormData[key] = "";
					}
				}
			});

			setFormData(updatedFormData);
			updateParams(updatedFormData);
			return;
		}

		setFormData(e.formData);
		updateParams(e.formData);
	};

	/**
	 * Filters the formData shown to the user and checks if it has file data and just returns the filename.
	 *
	 * @return {string} A formatted JSON string with file data replaced by filenames.
	 */
	const filterDisplayFormData = (): string => {
		return JSON.stringify(
			formData,
			(key, value) => {
				if (typeof value === "string" && value.includes("data:") && value.includes(";name=")) {
					const match = value.match(/;name=([^;]+)/);
					return match ? match[1] : value;
				}
				return value;
			},
			2
		);
	};

	return (
		<Card
			className={cn(
				"w-full dark:border-slate-800 dark:bg-slate-900",
				disabled && "pointer-events-none opacity-50"
			)}
		>
			<CardHeader className="py-3">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center text-lg dark:text-white">
						<Settings className="mr-2 h-5 w-5" />
						Parameters
						{disabled && <span className="ml-2 text-sm text-muted-foreground">(Function Running...)</span>}
					</CardTitle>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsCollapsed(!isCollapsed)}
						className="h-8 w-8 p-0"
						disabled={disabled}
					>
						{isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
					</Button>
				</div>
			</CardHeader>

			<CardContent
				className={cn(
					"pt-0 transition-all duration-200 ease-in-out",
					isCollapsed ? "max-h-0 overflow-hidden pb-0" : "max-h-96 overflow-y-auto"
				)}
			>
				<div className="space-y-4">
					<div className="space-y-4">
						{schema && (
							<div className="rounded-lg border p-4 dark:bg-slate-800">
								<div className="flex h-full gap-4">
									{/* Left Side - Form inputs (70%) */}
									<div className="flex-[0.7]">
										<Form
											schema={schema}
											validator={noValidator}
											onChange={handleFormChange}
											uiSchema={uiSchema}
											widgets={widgets}
											formData={formData}
										/>
									</div>

									{hasParamData && (
										<div className="flex-[0.3]">
											<div className="sticky top-0 h-fit rounded-lg bg-muted p-3">
												<h4 className="mb-2 text-sm font-medium">Current Parameters:</h4>
												<pre className="whitespace-pre-wrap break-words text-xs text-muted-foreground">
													{filterDisplayFormData()}
												</pre>
											</div>
										</div>
									)}
								</div>
							</div>
						)}

						{!schema && (
							<div className="bg-slate-30 rounded-lg border border-blue-200 p-6 dark:border-blue-900/30 dark:bg-blue-950/20 dark:bg-slate-800">
								<div className="flex items-center gap-4">
									<p className="text-sm text-slate-800 dark:text-blue-200">
										This function doesn't require any parameters. See the docs for how to add
										parameters.
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
