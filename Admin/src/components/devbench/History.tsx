import React from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {AlertTriangle, Check, Clock, Eye, Loader2, Play, Trash2, X} from 'lucide-react';
import {FuncInterface} from '@/types/types';
import {ParamsDataPopover} from "@components/devbench/ParamsDataPopover";
import {cn} from "@lib/utils";

interface RunHistoryItem {
    id: string;
    function: FuncInterface;
    params: any[];
    timestamp: Date;
    duration?: string;
    status: 'success' | 'error' | 'running';
}

interface RecentRunsProps {
    runs: RunHistoryItem[];
    onClear: () => void;
    onRerun: (run: RunHistoryItem) => void;
    onRemove: (id: string) => void;
    disabled?: boolean;
}

export default function History({ runs, onClear, onRerun, onRemove, disabled = false }: RecentRunsProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success':
                return 'dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800 bg-emerald-50 text-emerald-900 border-emerald-200';
            case 'error':
                return 'dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800 bg-rose-50 text-rose-900 border-rose-200';
            case 'running':
                return 'dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800 bg-blue-50 text-blue-900 border-blue-200';
            default:
                return 'dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 bg-slate-100 text-slate-900 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <Check className="w-3 h-3" />;
            case 'error':
                return <X className="w-3 h-3" />;
            case 'running':
                return <Loader2 className="w-3 h-3 animate-spin" />;
            default:
                return null;
        }
    };

    return (
        <Card className="h-full dark:bg-slate-900 dark:border-slate-800">
            <CardHeader className="pb-3 dark:border-slate-800">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center dark:text-slate-100">
                        History
                        {disabled && <span className="text-sm dark:text-slate-400 text-muted-foreground ml-2">(Function Running...)</span>}
                    </CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClear}
                        disabled={runs.length === 0 || disabled}
                        className="h-8 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Clear
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {runs.length === 0 ? (
                        <p className="text-sm dark:text-slate-400 text-muted-foreground text-center py-8">
                            No recent runs yet. Execute a function to see history here.
                        </p>
                    ) : (
                        runs.map((run) => (
                            <div
                                key={run.id}
                                className={cn(
                                    "border rounded-lg p-4 space-y-3 transition-all duration-200",
                                    "dark:hover:bg-slate-800/50 hover:bg-muted/30 hover:shadow-sm",
                                    run.status === 'running' && "dark:border-blue-800 dark:bg-blue-950/30 border-blue-200 bg-blue-50/30",
                                    run.status === 'success' && "dark:border-emerald-800 dark:bg-emerald-950/30 border-emerald-200 bg-emerald-50/30",
                                    run.status === 'error' && "dark:border-rose-800 dark:bg-rose-950/30 border-rose-200 bg-rose-50/30"
                                )}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-medium truncate dark:text-slate-200">
                                            {run.function.source}-&gt;{run.function.funcName}()
                                        </div>
                                        <div className="flex items-center text-xs dark:text-slate-400 text-muted-foreground mt-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {run.timestamp.toLocaleTimeString()}
                                            {run.duration && (
                                                <span className="ml-2">({run.duration}s)</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1 ml-2">
                                        <Badge
                                            className={`text-xs border ${getStatusColor(run.status)}`}
                                            variant="secondary"
                                        >
                                            <div className="flex items-center gap-1">
                                                {getStatusIcon(run.status)}
                                                {run.status}
                                            </div>
                                        </Badge>
                                    </div>
                                </div>

                                {run.params && Object.keys(run.params).length > 0 && (
                                    <div className="text-xs dark:text-slate-400 text-muted-foreground">
                                        <ParamsDataPopover params={run.params}>
                                            <div className="relative mt-1 p-2 dark:bg-slate-800 dark:text-slate-300 bg-muted/30 rounded text-xs font-mono cursor-pointer dark:hover:bg-slate-700 hover:bg-muted/50 transition-colors">
                                                {/* Absolute positioned icon trigger */}
                                                <div className="absolute top-2 right-2">
                                                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 dark:bg-slate-900/80 dark:hover:bg-slate-800 bg-background/80 hover:bg-background">
                                                        <Eye className="h-3 w-3" />
                                                    </Button>
                                                </div>

                                                {/* JSON content */}
                                                {JSON.stringify(run.params, null, 2).length > 100
                                                    ? `${JSON.stringify(run.params, null, 2).substring(0, 100)}...`
                                                    : JSON.stringify(run.params, null, 2)
                                                }
                                            </div>
                                        </ParamsDataPopover>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onRerun(run)}
                                            className="h-7 text-xs dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                            disabled={disabled}
                                        >
                                            <Play className="w-3 h-3 mr-1" />
                                            Rerun
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onRemove(run.id)}
                                        className="h-7 w-7 p-0 dark:text-slate-500 dark:hover:text-rose-400 text-muted-foreground hover:text-destructive"
                                        disabled={disabled}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
