import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {FileText, Copy, Check, Expand, Minimize2, Loader2, Code2, AlertCircle} from "lucide-react";
import { cn } from "@/lib/utils";
import JsonView from '@uiw/react-json-view';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@components/ui/tooltip";
import {FuncInterface} from "@/types/types";

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
        if (!response) return false;

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

        if (!contentToCopy) return;

        try {
            await navigator.clipboard.writeText(contentToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const renderContent = () => {
        if (!hasResponse && !hasError && !disabled) {
            return (
                <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-6">
                        {selectedFunction ? (
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-5 px-6 py-4 bg-gradient-to-r bg-blue-50  dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-slate-600 shadow-sm">
                                    <Code2 className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    <div className="text-left">
                                        <p className="text-xs font-semibold text-muted-foreground dark:text-slate-400 uppercase tracking-wide">Selected Function</p>
                                        <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                                            {selectedFunction.source}-&gt;{selectedFunction.funcName}()
                                        </p>
                                        {selectedFunction.description && (
                                            <p className="text-s text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                                                {selectedFunction.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <p className="text-muted-foreground/70 text-sm">
                                    Click <b>"Run Function"</b> to execute it and see results here.
                                </p>
                            </div>
                        ) : (
                            <p className="text-muted-foreground/70 text-sm">
                                Select a function above and click "Run Function" to execute it.
                            </p>
                        )}
                    </div>
                </div>
            );
        }

        if (disabled && !hasResponse && !hasError) {
            return (
                <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground text-sm">
                            Function is running... Results will appear here.
                        </p>
                    </div>
                </div>
            );
        }

        // Stacked layout: Error above Debug Log
        return (
            <div className="space-y-4">
                {hasError && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md overflow-hidden">
                        <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0 overflow-hidden">
                                <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2">Error Details</h4>
                                <pre className="text-sm text-red-800 dark:text-red-300 whitespace-pre-wrap break-words font-mono overflow-x-auto max-w-full" style={{ wordBreak: 'break-all' }}>
                                        {error}
                                    </pre>
                            </div>
                        </div>
                    </div>
                )}

                {hasResponse && (
                    <div className={cn(
                        "relative",
                        isExpanded ? "min-h-0" : "max-h-96 overflow-y-auto",
                    )}>
                        {isValidJson() ? (
                            <div className="p-4 bg-muted/20 rounded-md border border-border/50">
                                <JsonView
                                    value={JSON.parse(response)}
                                    collapsed={false}
                                    displayDataTypes={false}
                                    enableClipboard={false}
                                    style={{
                                        backgroundColor: 'transparent',
                                        fontSize: '14px',
                                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                                        '--w-rjv-font-family': 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                                        '--w-rjv-color': 'hsl(var(--foreground))',
                                        '--w-rjv-key-string': 'hsl(var(--foreground))',
                                        '--w-rjv-background-color': 'transparent',
                                        '--w-rjv-line-color': 'hsl(var(--border))',
                                        '--w-rjv-arrow-color': 'hsl(var(--muted-foreground))',
                                        '--w-rjv-edit-color': 'hsl(var(--muted-foreground))',
                                        '--w-rjv-info-color': 'hsl(var(--muted-foreground))',
                                        '--w-rjv-update-color': 'hsl(var(--muted-foreground))',
                                        '--w-rjv-string-color': 'hsl(var(--green-600))',
                                        '--w-rjv-number-color': 'hsl(var(--blue-600))',
                                        '--w-rjv-boolean-color': 'hsl(var(--purple-600))',
                                        '--w-rjv-null-color': 'hsl(var(--red-600))',
                                    } as React.CSSProperties}
                                />
                            </div>
                        ) : (
                            <pre className={cn(
                                "whitespace-pre-wrap break-words text-sm font-mono p-4 bg-muted/20 rounded-md",
                                "border border-border/50"
                            )}>
                                <code>{response}</code>
                            </pre>
                        )}
                    </div>
                )}

                {hasDebugLog && (
                    <div className={cn(
                        "relative",
                        isExpanded ? "min-h-0" : "max-h-96 overflow-y-auto",
                    )}>
                        <div>
                            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 px-4 pt-4">Debug Log (Showing last 50 lines)</h4>
                            <pre className={cn(
                                "whitespace-pre-wrap break-words text-xs font-mono p-4 bg-slate-800 text-slate-200 rounded-md",
                                "border border-slate-700"
                            )}>
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
            <Card className="flex flex-col h-full dark:bg-slate-900 dark:border-slate-800">
                <CardHeader className="pb-3 flex-shrink-0">
                    <div className="flex items-center gap-2 relative">
                        <FileText className="h-5 w-5" />
                        <CardTitle className="text-lg dark:text-white">Results</CardTitle>

                        { ((hasResponse && isValidJson()) || hasError || hasDebugLog) && (
                            <div className="absolute top-0 right-0 flex gap-2">
                                {(hasResponse && isValidJson()) && (
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
                                        <p>{copied ? "Copied to clipboard!" : (hasResponse || hasError || hasDebugLog) ? "Copy to clipboard" : "No content to copy"}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex-1 min-h-0">
                    {renderContent()}
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}
