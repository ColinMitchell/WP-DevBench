
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Copy, Check, Expand, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import JsonView from '@uiw/react-json-view';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@components/ui/tooltip";

interface ResultProps {
    response: string;
}

export default function Result({ response }: ResultProps) {
    const [copied, setCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const hasResponse = response && response.trim() !== "";

    // Check if response is valid JSON
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
        try {
            await navigator.clipboard.writeText(response);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const renderContent = () => {
        if (!hasResponse) {
            return (
                <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-3">
                        <p className="text-muted-foreground/70 text-sm">
                            Select a function above and click "Run Function" to execute it
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className={cn(
                "relative",
                isExpanded ? "min-h-0" : "max-h-96 overflow-y-auto"
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
                                '--w-rjv-key-string': 'hsl(var(--primary))',
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
        );
    };

    return (
        <TooltipProvider>
        <Card className="flex flex-col h-full">
            <CardHeader className="pb-3 flex-shrink-0">
                <div className="flex items-center gap-2 relative">
                    <FileText className="h-5 w-5" />
                    <CardTitle className="text-lg">Results</CardTitle>

                    { ( response && isValidJson() ) && (
                        <div className="absolute top-0 right-0 flex gap-2">
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

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={copyToClipboard}
                                        className="h-7 w-7 p-0"
                                        disabled={!hasResponse}
                                    >
                                        {copied ? (
                                            <Check className="h-3 w-3 text-green-600" />
                                        ) : (
                                            <Copy className="h-3 w-3" />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{copied ? "Copied to clipboard!" : hasResponse ? "Copy results to clipboard" : "No results to copy"}</p>
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
