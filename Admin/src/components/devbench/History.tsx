
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Clock, Play } from 'lucide-react';
import { FuncInterface } from '@/types/types';

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
}

export default function History({ runs, onClear, onRerun, onRemove }: RecentRunsProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success':
                return 'bg-green-100 text-green-800';
            case 'error':
                return 'bg-red-100 text-red-800';
            case 'running':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">History</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClear}
                        disabled={runs.length === 0}
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
                                className="border rounded-lg p-3 space-y-2 hover:bg-muted/50 transition-colors"
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
                                            className={`text-xs ${getStatusColor(run.status)}`}
                                            variant="secondary"
                                        >
                                            {run.status}
                                        </Badge>
                                    </div>
                                </div>

                                {run.params && Object.keys(run.params).length > 0 && (
                                    <div className="text-xs text-muted-foreground">
                                        Params: {JSON.stringify(run.params, null, 0).substring(0, 50)}
                                        {JSON.stringify(run.params, null, 0).length > 50 && '...'}
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onRerun(run)}
                                        className="h-6 text-xs"
                                    >
                                        <Play className="w-3 h-3 mr-1" />
                                        Rerun
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onRemove(run.id)}
                                        className="h-6 text-xs text-muted-foreground hover:text-destructive"
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
