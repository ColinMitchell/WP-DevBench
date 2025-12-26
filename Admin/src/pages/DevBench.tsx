import {Button} from "@/components/ui/button";
import {Separator} from "@components/ui/separator"
import React, {useEffect, useState} from "react";
import Wrapper from "@components/global/Wrapper";
import Selector from "@components/devbench/Selector";
import {useToast} from "@components/ui/use-toast"
import {apiClient} from "@utils/client"
import {FuncInterface} from "@/types/types";
import {CircleCheck, LoaderCircle, Play, Settings, ToolCase} from "lucide-react";
import Result from "@components/devbench/Result";
import History from "@components/devbench/History";
import FunctionParams from "@components/devbench/FunctionParams";
import {ThemeToggle} from "@components/global/ThemeToggle";
import DocsModal from "@components/global/DocsModal";

interface ApiResponse {
    success: boolean;
    result?: any;
    error?: string;
    code?: string;
    status_code?: number;
    debug_log?: string | null;
}

interface RunHistoryItem {
    id: string;
    function: FuncInterface;
    params: any[];
    timestamp: Date;
    duration?: string;
    status: 'success' | 'error' | 'running';
    result?: any;
    error?: string;
    debug_log?: string | null;
}

export default function DevBench() {

    const [selectedFunction, setSelectedFunction] = React.useState <FuncInterface | null>(null)
    const [loading, setLoading] = React.useState <boolean>(false)
    const [functions, setFunctions] = useState<FuncInterface[] | null>(null);
    const [funcResponse, setFuncResponse] = useState<string>("");
    const [paramData, setParamData] = useState<any>([]);
    const [runHistory, setRunHistory] = useState<RunHistoryItem[]>([]);
    const [responseError, setResponseError] = useState<string | null>(null);
    const [debugLog, setDebugLog] = useState<string | null>(null);
    const {toast} = useToast();

    /**
     * Main Run Function... function
     */
    const runFunction = async (overrideFunction?: FuncInterface, overrideParams?: any) => {
        const functionToUse = overrideFunction || selectedFunction;
        const paramsToUse = overrideParams !== undefined ? overrideParams : paramData;

        if (!functionToUse) {
            return;
        }

        const runId = Date.now().toString();
        setLoading(true);
        setFuncResponse("");
        setResponseError(null);
        setDebugLog(null);

        const startTime = Date.now();

        const newRun: RunHistoryItem = {
            id: runId,
            function: functionToUse,
            params: paramsToUse,
            timestamp: new Date(),
            status: 'running'
        };

        setRunHistory(prev => {
            const updated = [newRun, ...prev];
            return updated.slice(0, 20);
        });

        toast({
            title: `Running: ${functionToUse.source} → ${functionToUse.funcName}()`,
            description: (
                <span className="flex items-center">
                        <LoaderCircle className="w-4 h-4 dark:text-slate-400 text-gray-400 animate-spin mr-2" />
                        Started at: {new Date(startTime).toLocaleTimeString()}
                    </span>
            ),
            duration: 100000,
        });

        try {
            const response = await apiClient.post(
                {
                    funcName: functionToUse.funcName,
                    paramData: paramsToUse,
                    username: window.wpDevBench.userName
                },
                "/devbench/functions"
            ) as ApiResponse;

            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);

            if (response.success) {
                // Success case
                setFuncResponse(JSON.stringify(response.result, null, 2));
                setResponseError(null);
                setDebugLog(null);

                setRunHistory(prev => prev.map(run =>
                    run.id === runId
                        ? {
                            ...run,
                            status: 'success' as const,
                            duration,
                            result: response.result
                          }
                        : run
                ));

                toast({
                    title: `${functionToUse.source}->${functionToUse.funcName}() Completed!`,
                    description: (
                        <span className="flex items-center">
                        <CircleCheck className="w-4 h-4 text-green-800 mr-2"/>
                        Execution time: {duration} seconds
                    </span>
                    ),
                    duration: 10000,
                });
            } else {
                // Error case
                setFuncResponse("");
                setResponseError(response.error || 'Unknown error occurred');
                setDebugLog(response.debug_log || null);

                setRunHistory(prev => prev.map(run =>
                    run.id === runId
                        ? {
                            ...run,
                            status: 'error' as const,
                            duration,
                            error: response.error,
                            debug_log: response.debug_log
                          }
                        : run
                ));

                toast({
                    variant: "destructive",
                    title: `Error running function: ${functionToUse.source}->${functionToUse.funcName}()`,
                    description: response.error || "See the results panel for more details.",
                    duration: 10000,
                });
            }
        } catch (error: any) {
            const errorMessage = error?.message || 'Network error occurred';

            setRunHistory(prev => prev.map(run =>
                run.id === runId
                    ? { ...run, status: 'error' as const, error: errorMessage }
                    : run
            ));

            setResponseError(errorMessage);
            setFuncResponse("");
            setDebugLog(null);

            toast({
                variant: "destructive",
                title: `Error running function: ${functionToUse.source}->${functionToUse.funcName}()`,
                description: "Check your network connection and try again.",
                duration: 10000,
            });
        } finally {
            setLoading(false);
        }
    }

    /**
     * Clear the results data
     */
    const clearResults = () => {
        setFuncResponse("");
        setResponseError(null);
        setDebugLog(null);
    };

    /**
     * Get a list of all the functions from the api
     */
    const getFunctions = async () => {
        const response: unknown = await apiClient.get('/devbench/functions')
            .catch(error => {
                const message =
                    typeof error.message === "object" && Object.keys(error.message).length > 0
                        ? JSON.stringify(error.message)
                        : error.response.statusText;

                console.log(message);
                return;
            });

        const data: FuncInterface[] = response as FuncInterface[];

        console.log( data );

        setFunctions(data);
    };

        /**
         * Update the params state
         * @param data
         */
        const updateParams = (data: any) => {
            setParamData(data || {});
        }

    /**
     * Generate default params from function schema
     */
    const generateDefaultParams = (func: FuncInterface | null): any => {
        if (!func || !func.params) {
            return {};
        }

        const defaults: any = {};

        if (func.params.properties && typeof func.params.properties === 'object') {
            Object.keys(func.params.properties).forEach(key => {
                const property = func.params!.properties![key];

                // Type guard: ensure property is an object and not false
                if (!property || typeof property !== 'object') {
                    defaults[key] = '';
                    return;
                }

                const propType = (property as any).type;

                // Set default based on type
                switch (propType) {
                    case 'boolean':
                        defaults[key] = false;
                        break;
                    case 'number':
                    case 'integer':
                        defaults[key] = 0;
                        break;
                    case 'array':
                        defaults[key] = [];
                        break;
                    case 'object':
                        defaults[key] = {};
                        break;
                    case 'string':
                    default:
                        defaults[key] = '';
                        break;
                }
            });
        }

        return defaults;
    };

    /**
     * Clear all run history
     */
    const clearRunHistory = () => {
        setRunHistory([]);
        localStorage.removeItem('runHistory');
    };

    /**
     * Remove a specific run from history
     */
    const removeRun = (id: string) => {
        setRunHistory(prev => {
            const updated = prev.filter(run => run.id !== id);
            localStorage.setItem('runHistory', JSON.stringify(updated));
            return updated;
        });
    };

    /**
     * Rerun a previous function execution
     */
    const rerunFunction = (run: RunHistoryItem) => {
        setSelectedFunction(run.function);

        // Use setTimeout to ensure the selectedFunction state update completes first
        setTimeout(() => {
            setParamData(run.params);
            // Then run the function
            setTimeout(() => {
                runFunction(run.function, run.params);
            }, 0);
        }, 0);
    };

    // init useEffect
    useEffect(() => {
        getFunctions();
    }, []);

    useEffect(() => {
        // Load the selected function from localStorage when the component mounts
        const storedFunction = localStorage.getItem('selectedFunction');
        const storedRunHistory = localStorage.getItem('runHistory');

        if (storedFunction) {
            setSelectedFunction(JSON.parse(storedFunction));
        }

        if (storedRunHistory) {
            const parsed = JSON.parse(storedRunHistory);
            // Convert timestamp strings back to Date objects
            const withDates = parsed.map((run: any) => ({
                ...run,
                timestamp: new Date(run.timestamp)
            }));
            setRunHistory(withDates);
        }
    }, []);

    useEffect(() => {
        // Save the selected function to localStorage whenever it changes
        if (selectedFunction) {
            localStorage.setItem('selectedFunction', JSON.stringify(selectedFunction));
            // Initialize params with default values from the function schema
            const defaultParams = generateDefaultParams(selectedFunction);
            setParamData(defaultParams);
        } else {
            localStorage.removeItem('selectedFunction');
        }
    }, [selectedFunction]);

    useEffect(() => {
        // Save run history to localStorage
        if (runHistory.length > 0) {
            localStorage.setItem('runHistory', JSON.stringify(runHistory));
        }
    }, [runHistory]);

    // Add event listener for Enter key
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter" && !loading && selectedFunction) {
                runFunction();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [loading, selectedFunction, paramData]);

    return (
        <Wrapper title="WP DevBench">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-slate-50 dark:bg-slate-950">
                <div className="bg-white dark:bg-slate-900">
                    <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                                <ToolCase className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-xl whitespace-nowrap font-bold text-slate-900 dark:text-white">
                                WP DevBench
                            </h1>
                        </div>

                        <div className="ml-auto flex-auto flex w-full space-x-2 sm:justify-end">
                            <DocsModal />
                            <Selector
                                functions={functions}
                                selectedFunction={selectedFunction}
                                setSelectedFunction={setSelectedFunction}
                                onClearResults={clearResults}
                            />
                            <Button
                                onClick={() => runFunction()}
                                disabled={!selectedFunction || loading}
                                className="px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
                            >
                                <Play className="w-4 h-4 mr-2"/>
                                {loading ? 'Running...' : 'Run Function'}
                            </Button>
                        </div>
                    </div>
                </div>

                <Separator/>

                {/* Main Content Area */}
                <div className="container py-6 bg-slate-50 dark:bg-slate-950">
                    <div className="flex gap-6 h-full">
                        {/* Left Side - 70% */}
                        <div className="space-y-6 flex-[0.7]">
                            {selectedFunction && (
                                <FunctionParams
                                    selectedFunction={selectedFunction}
                                    paramData={paramData}
                                    updateParams={updateParams}
                                    loading={loading}
                                    disabled={loading}
                                />
                            )}

                            <div className="bg-slate-50 rounded-lg dark:bg-slate-900">
                                <Result
                                    response={funcResponse}
                                    error={responseError}
                                    debugLog={debugLog}
                                    disabled={loading}
                                    selectedFunction={selectedFunction}
                                />
                            </div>
                        </div>

                        {/* Right Side - 30% */}
                        <div className="flex-shrink-0 flex-[0.3]">
                            <div className="flex flex-col gap-4">
                                <History
                                    runs={runHistory}
                                    onClear={clearRunHistory}
                                    onRerun={rerunFunction}
                                    onRemove={removeRun}
                                    disabled={loading}
                                />
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}
