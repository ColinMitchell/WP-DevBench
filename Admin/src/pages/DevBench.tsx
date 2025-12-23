import {Button} from "@/components/ui/button";
import {Separator} from "@components/ui/separator"
import React, {useEffect, useState} from "react";
import Wrapper from "@components/global/Wrapper";
import Selector from "@components/devbench/Selector";
import {useToast} from "@components/ui/use-toast"
import {apiClient} from "@utils/client"
import {FuncInterface} from "@/types/types";
import {CircleCheck, LoaderCircle, Play} from "lucide-react";
import Result from "@components/devbench/Result";
import History from "@components/devbench/History";
import FunctionParams from "@components/devbench/FunctionParams";

interface RunHistoryItem {
    id: string;
    function: FuncInterface;
    params: any[];
    timestamp: Date;
    duration?: string;
    status: 'success' | 'error' | 'running';
}

export default function DevBench() {

    const [selectedFunction, setSelectedFunction] = React.useState <FuncInterface | null>(null)
    const [loading, setLoading] = React.useState <boolean>(false)
    const [functions, setFunctions] = useState<FuncInterface[] | null>(null);
    const [funcResponse, setFuncResponse] = useState<string>("");
    const [paramData, setParamData] = useState<any>([]);
    const [runHistory, setRunHistory] = useState<RunHistoryItem[]>([]);
    const {toast} = useToast();

    /**
     * Main Run Function... function
     */
    const runFunction = async () => {
        if (!selectedFunction) {
            return;
        }

        const runId = Date.now().toString();
        setLoading(true);

        const startTime = Date.now();

        // Add to run history with running status
        const newRun: RunHistoryItem = {
            id: runId,
            function: selectedFunction,
            params: paramData,
            timestamp: new Date(),
            status: 'running'
        };

        setRunHistory(prev => [newRun, ...prev]);

        // Start Function Toast
        toast({
            title: `Running: ${selectedFunction.class} → ${selectedFunction.funcName}()`,
            description: (
                <span className="flex items-center">
                <LoaderCircle className="w-4 h-4 text-gray-400 animate-spin mr-2" />
                Started at: {new Date(startTime).toLocaleTimeString()}
            </span>
            ),
            duration: 100000,
        });

        try {
            const response = await apiClient.post(
                {
                    funcName: selectedFunction.funcName,
                    paramData,
                    username: window.wpDevBench.userName
                },
                "/devbench/functions"
            );

            const endTime = Date.now(); // Capture end time
            const duration = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds

            // Update run history with success status
            setRunHistory(prev => prev.map(run =>
                run.id === runId
                    ? { ...run, status: 'success' as const, duration }
                    : run
            ));

            // Completed Function Toast
            toast({
                title: `${selectedFunction.class}->${selectedFunction.funcName}() Completed!`,
                description: (
                    <span className="flex items-center">
						<CircleCheck  className="w-4 h-4 text-green-800 mr-2"/>
                Execution time: {duration} seconds
            </span>
                ),
                duration: 10000,
            });

            setFuncResponse(JSON.stringify(response, null, 2).replace(/^"|"$/g, ""));
        } catch (error) {
            // Update run history with error status
            setRunHistory(prev => prev.map(run =>
                run.id === runId
                    ? { ...run, status: 'error' as const }
                    : run
            ));

            // Error Toast
            toast({
                variant: "destructive",
                title: `Error running function: ${selectedFunction.class}->${selectedFunction.funcName}()`,
                description: "See the debug.log for more information and try again.",
                duration: 10000,
            });
        } finally {
            setLoading(false);
        }
    }

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
     * Run function with specific parameters
     */
    const runFunctionWithParams = async (func: FuncInterface, params: any[]) => {
        const runId = Date.now().toString();
        setLoading(true);

        const startTime = Date.now();

        // Add to run history with running status
        const newRun: RunHistoryItem = {
            id: runId,
            function: func,
            params: params,
            timestamp: new Date(),
            status: 'running'
        };

        setRunHistory(prev => [newRun, ...prev]);

        // Start Function Toast
        toast({
            title: `Running: ${func.class} → ${func.funcName}()`,
            description: (
                <span className="flex items-center">
            <LoaderCircle className="w-4 h-4 text-gray-400 animate-spin mr-2" />
            Started at: {new Date(startTime).toLocaleTimeString()}
        </span>
            ),
            duration: 100000,
        });

        try {
            const response = await apiClient.post(
                {
                    funcName: func.funcName,
                    paramData: params,
                    username: window.wpDevBench.userName
                },
                "/devbench/functions"
            );

            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);

            // Update run history with success status
            setRunHistory(prev => prev.map(run =>
                run.id === runId
                    ? { ...run, status: 'success' as const, duration }
                    : run
            ));

            // Completed Function Toast
            toast({
                title: `${func.class}->${func.funcName}() Completed!`,
                description: (
                    <span className="flex items-center">
						<CircleCheck  className="w-4 h-4 text-green-800 mr-2"/>
                Execution time: {duration} seconds
            </span>
            ),
            duration: 10000,
        });

        setFuncResponse(JSON.stringify(response, null, 2).replace(/^"|"$/g, ""));
    } catch (error) {
        // Update run history with error status
        setRunHistory(prev => prev.map(run =>
            run.id === runId
                ? { ...run, status: 'error' as const }
                : run
        ));

        // Error Toast
        toast({
            variant: "destructive",
            title: `Error running function: ${func.class}->${func.funcName}()`,
            description: "See the debug.log for more information and try again.",
            duration: 10000,
        });
    } finally {
        setLoading(false);
    }
};

    /**
     * Rerun a previous function execution
     */
    const rerunFunction = (run: RunHistoryItem) => {
        console.log( run );

        // Set the selected function first
        setSelectedFunction(run.function);

        // Use a timeout to ensure the function is set and component has re-rendered
        // before setting the param data and running the function
        setTimeout(() => {
            setParamData(run.params);
            // Run the function directly with the stored parameters
            runFunctionWithParams(run.function, run.params);
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
            // Only clear param data if function is changed via selector, not rerun
            // setParamData({});
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
    }, [loading, selectedFunction]);

    return (
        <Wrapper title="Sandbox">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                {/* Header with function selector */}
                <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
                    <h2 className="text-lg font-semibold whitespace-nowrap flex-none">Function Runner</h2>
                    <div className="ml-auto flex-auto flex w-full space-x-2 sm:justify-end">
                        <Selector functions={functions} selectedFunction={selectedFunction} setSelectedFunction={setSelectedFunction}/>
                        <Button
                            onClick={runFunction}
                            disabled={!selectedFunction || loading}
                            className="px-4 bg-primary hover:bg-primary/90"
                        >
                            <Play className="w-4 h-4 mr-2"/>
                            {loading ? 'Running...' : 'Run Function'}
                        </Button>
                    </div>
                </div>
                <Separator/>

                {/* Main Content Area */}
                <div className="container py-6 bg-gray-50">
                    <div className="flex gap-6 h-full">
                        {/* Left Side - 70% */}
                        <div className="flex-1 space-y-6" style={{ flexBasis: '70%' }}>
                            {selectedFunction && selectedFunction.params !== null && (
                                <FunctionParams
                                    selectedFunction={selectedFunction}
                                    paramData={paramData}
                                    updateParams={updateParams}
                                    onRun={runFunction}
                                    loading={loading}
                                />
                            )}

                            <div className="bg-gray-50 rounded-lg">
                                <Result response={funcResponse}/>
                            </div>
                        </div>

                        {/* Right Side - 30% */}
                        <div className="flex-shrink-0" style={{ flexBasis: '30%' }}>
                            <History
                                runs={runHistory}
                                onClear={clearRunHistory}
                                onRerun={rerunFunction}
                                onRemove={removeRun}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}
