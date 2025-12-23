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
                return 'bg-green-100 text-green-800 border-green-200';
            case 'error':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'running':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
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
        <Card className="h-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                        History
                        {disabled && <span className="text-sm text-muted-foreground ml-2">(Function Running...)</span>}
                    </CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClear}
                        disabled={runs.length === 0 || disabled}
                        className="h-8"
                    >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Clear
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {runs.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No recent runs yet. Execute a function to see history here.
                        </p>
                    ) : (
                        runs.map((run) => (
                            <div
                                key={run.id}
                                className={cn(
                                    "border rounded-lg p-4 space-y-3 transition-all duration-200",
                                    "hover:bg-muted/30 hover:shadow-sm",
                                    run.status === 'running' && "border-blue-200 bg-blue-50/30",
                                    run.status === 'success' && "border-green-200 bg-green-50/30",
                                    run.status === 'error' && "border-red-200 bg-red-50/30"
                                )}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-medium truncate">
                                            {run.function.class}::{run.function.funcName}()
                                        </div>
                                        <div className="flex items-center text-xs text-muted-foreground mt-1">
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
                                    <div className="text-xs text-muted-foreground">
                                        <ParamsDataPopover params={run.params}>
                                            <div className="relative mt-1 p-2 bg-muted/30 rounded text-xs font-mono cursor-pointer hover:bg-muted/50 transition-colors">
                                                {/* Absolute positioned icon trigger */}
                                                <div className="absolute top-2 right-2">
                                                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 bg-background/80 hover:bg-background">
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
                                            className="h-7 text-xs"
                                            disabled={disabled}
                                        >
                                            <Play className="w-3 h-3 mr-1" />
                                            Rerun
                                        </Button>
                                        {run.status === 'error' && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs text-amber-600 hover:text-amber-700"
                                                onClick={() => {/* Add error details handler */}}
                                            >
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                Details
                                            </Button>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onRemove(run.id)}
                                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
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
