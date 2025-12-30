import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Eye, Loader2, Play, Trash2, X } from "lucide-react";
import { FuncInterface } from "@/types/types";
import { ParamsDataPopover } from "@components/devbench/ParamsDataPopover";
import { cn } from "@lib/utils";

enum RunStatus {
    SUCCESS = "success",
    ERROR = "error",
    RUNNING = "running"
}

const STATUS_COLORS: Record<RunStatus, string> = {
    [RunStatus.SUCCESS]: "dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800 bg-emerald-50 text-emerald-900 border-emerald-200",
    [RunStatus.ERROR]: "dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800 bg-rose-50 text-rose-900 border-rose-200",
    [RunStatus.RUNNING]: "dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800 bg-blue-50 text-blue-900 border-blue-200"
};

interface RunHistoryItem {
	id: string;
	function: FuncInterface;
	params: any[];
	timestamp: Date;
	duration?: string;
	status: RunStatus;
}

interface RecentRunsProps {
	runs: RunHistoryItem[];
	onClear: () => void;
	onRerun: (run: RunHistoryItem) => void;
	onRemove: (id: string) => void;
	disabled?: boolean;
}

export default function History({ runs, onClear, onRerun, onRemove, disabled = false }: RecentRunsProps) {
    const getStatusColor = (status: RunStatus): string => {
        return STATUS_COLORS[status] || "dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 bg-slate-100 text-slate-900 border-slate-200";
    };

	const getStatusIcon = (status: string) => {
		switch (status) {
			case RunStatus.SUCCESS:
				return <Check className="h-3 w-3" />;
			case RunStatus.ERROR:
				return <X className="h-3 w-3" />;
			case RunStatus.RUNNING:
				return <Loader2 className="h-3 w-3 animate-spin" />;
			default:
				return null;
		}
	};

	return (
		<Card className="h-full dark:border-slate-800 dark:bg-slate-900">
			<CardHeader className="pb-3 dark:border-slate-800">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center text-lg dark:text-slate-100">
						History
						{disabled && (
							<span className="ml-2 text-sm text-muted-foreground dark:text-slate-400">
								(Function Running...)
							</span>
						)}
					</CardTitle>
					<Button
						variant="outline"
						size="sm"
						onClick={onClear}
						disabled={runs.length === 0 || disabled}
						className="h-8 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
					>
						<Trash2 className="mr-1 h-4 w-4" />
						Clear
					</Button>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="max-h-[600px] space-y-3 overflow-y-auto">
					{runs.length === 0 ? (
						<p className="py-8 text-center text-sm text-muted-foreground dark:text-slate-400">
							No recent runs yet. Execute a function to see history here.
						</p>
					) : (
						runs.map((run) => (
							<div
								key={run.id}
								className={cn(
									"space-y-3 rounded-lg border p-4 transition-all duration-200",
									"hover:bg-muted/30 hover:shadow-sm dark:hover:bg-slate-800/50",
									run.status === "running" &&
										"border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-950/30",
									run.status === "success" &&
										"border-emerald-200 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-950/30",
									run.status === "error" &&
										"border-rose-200 bg-rose-50/30 dark:border-rose-800 dark:bg-rose-950/30"
								)}
							>
								<div className="flex items-start justify-between">
									<div className="min-w-0 flex-1">
										<div className="truncate text-sm font-medium dark:text-slate-200">
											{run.function.source}-&gt;{run.function.funcName}()
										</div>
										<div className="mt-1 flex items-center text-xs text-muted-foreground dark:text-slate-400">
											<Clock className="mr-1 h-3 w-3" />
											{run.timestamp.toLocaleTimeString()}
											{run.duration && <span className="ml-2">({run.duration}s)</span>}
										</div>
									</div>
									<div className="ml-2 flex items-center space-x-1">
										<Badge
											className={`border text-xs ${getStatusColor(run.status)}`}
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
									<div className="text-xs text-muted-foreground dark:text-slate-400">
										<ParamsDataPopover params={run.params}>
											<div className="relative mt-1 cursor-pointer rounded bg-muted/30 p-2 font-mono text-xs transition-colors hover:bg-muted/50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
												<div className="absolute right-2 top-2">
													<Button
														variant="ghost"
														size="sm"
														className="h-5 w-5 bg-background/80 p-0 hover:bg-background dark:bg-slate-900/80 dark:hover:bg-slate-800"
													>
														<Eye className="h-3 w-3" />
													</Button>
												</div>

												{JSON.stringify(run.params, null, 2).length > 100
													? `${JSON.stringify(run.params, null, 2).substring(0, 100)}...`
													: JSON.stringify(run.params, null, 2)}
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
											<Play className="mr-1 h-3 w-3" />
											Rerun
										</Button>
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onRemove(run.id)}
										className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive dark:text-slate-500 dark:hover:text-rose-400"
										disabled={disabled}
									>
										<Trash2 className="h-3 w-3" />
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
