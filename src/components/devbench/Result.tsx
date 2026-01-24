import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Copy, Check, Expand, Minimize2, Loader2, Code2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import JsonView from "@uiw/react-json-view";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";
import { FuncInterface } from "@/types/types";

interface ResultProps {
	response: string;
	error?: string | null;
	debugLog?: string | null;
	disabled?: boolean;
	selectedFunction?: FuncInterface | null;
}

export default function Result({ response, error, debugLog, disabled = false, selectedFunction }: ResultProps) {
	const [copied, setCopied] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);

	const hasResponse = response && response.trim() !== "";
	const hasError = error && error.trim() !== "";
	const hasDebugLog = debugLog && debugLog.trim() !== "";

	const isValidJson = () => {
		if (!response) {
			return false;
		}

		try {
			JSON.parse(response);
			return true;
		} catch {
			return false;
		}
	};

	const copyToClipboard = async () => {
		let contentToCopy = "";

		if (hasError) {
			contentToCopy = error;
		} else if (hasResponse) {
			contentToCopy = response;
		} else if (hasDebugLog) {
			contentToCopy = debugLog;
		}

		if (!contentToCopy) {
			return;
		}

		try {
			await navigator.clipboard.writeText(contentToCopy);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy: ", err);
		}
	};

	const renderContent = () => {
		if (!hasResponse && !hasError && !disabled) {
			return (
				<div className="flex h-full items-center justify-center">
					<div className="space-y-6 text-center">
						{selectedFunction ? (
							<div className="space-y-4">
								<div className="inline-flex items-center gap-5 rounded-lg border border-blue-200 bg-blue-50 bg-gradient-to-r px-6 py-4 shadow-sm dark:border-slate-600 dark:bg-slate-800">
									<Code2 className="h-6 w-6 flex-shrink-0 text-blue-600 dark:text-blue-400" />
									<div className="text-left">
										<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground dark:text-slate-400">
											Selected Function
										</p>
										<p className="font-mono text-sm font-bold text-slate-900 dark:text-white">
											{selectedFunction.source}-&gt;{selectedFunction.funcName}()
										</p>
										{selectedFunction.description && (
											<p className="text-s mt-2 leading-relaxed text-slate-600 dark:text-slate-300">
												{selectedFunction.description}
											</p>
										)}
									</div>
								</div>
								<p className="text-sm text-muted-foreground/70">
									Click <b>"Run Function"</b> to execute it and see results here.
								</p>
							</div>
						) : (
							<p className="text-sm text-muted-foreground/70">
								Select a function above and click "Run Function" to execute it.
							</p>
						)}
					</div>
				</div>
			);
		}

		if (disabled && !hasResponse && !hasError) {
			return (
				<div className="flex h-full items-center justify-center">
					<div className="space-y-3 text-center">
						<Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
						<p className="text-sm text-muted-foreground">
							Function is running... Results will appear here.
						</p>
					</div>
				</div>
			);
		}

		return (
			<div className="space-y-4">
				{hasError && (
					<div className="overflow-hidden rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
						<div className="flex gap-3">
							<AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
							<div className="min-w-0 flex-1 overflow-hidden">
								<h4 className="mb-2 font-semibold text-red-900 dark:text-red-200">Error Details</h4>
								<pre
									className="max-w-full overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm text-red-800 dark:text-red-300"
									style={{ wordBreak: "break-all" }}
								>
									{error}
								</pre>
							</div>
						</div>
					</div>
				)}

				{hasResponse && (
					<div className={cn("relative", isExpanded ? "min-h-0" : "max-h-96 overflow-y-auto")}>
						{isValidJson() ? (
							<div className="rounded-md border border-border/50 bg-muted/20 p-4">
								<JsonView
									value={JSON.parse(response)}
									collapsed={false}
									displayDataTypes={false}
									enableClipboard={false}
									style={
										{
											backgroundColor: "transparent",
											fontSize: "14px",
											fontFamily:
												'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
											"--w-rjv-font-family":
												'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
											"--w-rjv-color": "hsl(var(--foreground))",
											"--w-rjv-key-string": "hsl(var(--foreground))",
											"--w-rjv-background-color": "transparent",
											"--w-rjv-line-color": "hsl(var(--border))",
											"--w-rjv-arrow-color": "hsl(var(--muted-foreground))",
											"--w-rjv-edit-color": "hsl(var(--muted-foreground))",
											"--w-rjv-info-color": "hsl(var(--muted-foreground))",
											"--w-rjv-update-color": "hsl(var(--muted-foreground))",
											"--w-rjv-string-color": "hsl(var(--green-600))",
											"--w-rjv-number-color": "hsl(var(--blue-600))",
											"--w-rjv-boolean-color": "hsl(var(--purple-600))",
											"--w-rjv-null-color": "hsl(var(--red-600))",
										} as React.CSSProperties
									}
								/>
							</div>
						) : (
							<pre
								className={cn(
									"whitespace-pre-wrap break-words rounded-md bg-muted/20 p-4 font-mono text-sm",
									"border border-border/50"
								)}
							>
								<code>{response}</code>
							</pre>
						)}
					</div>
				)}

				{hasDebugLog && (
					<div className={cn("relative", isExpanded ? "min-h-0" : "max-h-96 overflow-y-auto")}>
						<div>
							<h4 className="mb-2 px-4 pt-4 font-semibold text-slate-700 dark:text-slate-300">
								Debug Log (Showing last 50 lines)
							</h4>
							<pre
								className={cn(
									"whitespace-pre-wrap break-words rounded-md bg-slate-800 p-4 font-mono text-xs text-slate-200",
									"border border-slate-700"
								)}
							>
								<code>{debugLog}</code>
							</pre>
						</div>
					</div>
				)}
			</div>
		);
	};

	return (
		<TooltipProvider>
			<Card className="flex h-full flex-col dark:border-slate-800 dark:bg-slate-900">
				<CardHeader className="flex-shrink-0 pb-3">
					<div className="relative flex items-center gap-2">
						<FileText className="h-5 w-5" />
						<CardTitle className="text-lg dark:text-white">Results</CardTitle>

						{((hasResponse && isValidJson()) || hasError || hasDebugLog) && (
							<div className="absolute right-0 top-0 flex gap-2">
								{hasResponse && isValidJson() && (
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="secondary"
												size="sm"
												onClick={() => setIsExpanded(!isExpanded)}
												className="h-7 w-7 p-0"
											>
												{isExpanded ? (
													<Minimize2 className="h-3 w-3" />
												) : (
													<Expand className="h-3 w-3" />
												)}
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>{isExpanded ? "Minimize results area" : "Expand results area"}</p>
										</TooltipContent>
									</Tooltip>
								)}

								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="secondary"
											size="sm"
											onClick={copyToClipboard}
											className="h-7 w-7 p-0"
											disabled={!hasResponse && !hasError && !hasDebugLog}
										>
											{copied ? (
												<Check className="h-3 w-3 text-green-600" />
											) : (
												<Copy className="h-3 w-3" />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>
											{copied
												? "Copied to clipboard!"
												: hasResponse || hasError || hasDebugLog
													? "Copy to clipboard"
													: "No content to copy"}
										</p>
									</TooltipContent>
								</Tooltip>
							</div>
						)}
					</div>
				</CardHeader>
				<CardContent className="min-h-0 flex-1">{renderContent()}</CardContent>
			</Card>
		</TooltipProvider>
	);
}
