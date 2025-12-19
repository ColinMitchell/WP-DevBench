import {Button} from "@/components/ui/button";
import {Separator} from "@components/ui/separator"
import React, {useEffect, useState} from "react";
import Wrapper from "@components/global/Wrapper";
import Selector from "@components/devbench/Selector";
import ParamsPopover from "@components/devbench/ParamsPopover";
import {Textarea} from "@components/ui/textarea";
import {useToast} from "@components/ui/use-toast"
import {apiClient} from "@utils/client"
import {FuncInterface} from "@/types/types";
import {CircleCheck, LoaderCircle} from "lucide-react";

export default function DevBench() {

	const [selectedFunction, setSelectedFunction] = React.useState <FuncInterface | null>(null)
	const [loading, setLoading] = React.useState <boolean>(false)
	const [functions, setFunctions] = useState<FuncInterface[] | null>(null);
	const [funcResponse, setFuncResponse] = useState<string>("");
	const [paramData, setParamData] = useState<Array<any>>([]);
	const {toast} = useToast();

	/**
	 * Main Run Function... function
	 */
	const runFunction = async () => {
		if (!selectedFunction) {
			return;
		}

		setLoading(true);

		const startTime = Date.now();

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

		console.log( paramData );

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
		setParamData(data);
	}

	// init useEffect
	useEffect(() => {
		getFunctions();
	}, []);

	useEffect(() => {
		// Load the selected function from localStorage when the component mounts
		const storedFunction = localStorage.getItem('selectedFunction');
		//const storedFunctionParamData = localStorage.getItem('selectedFunctionParamData');

		if (storedFunction) {
			setSelectedFunction(JSON.parse(storedFunction));
		}
		/*if (storedFunctionParamData) {
			setParamData(JSON.parse(storedFunctionParamData));
		}*/
	}, []);

	useEffect(() => {
		// Save the selected function to localStorage whenever it changes
		if (selectedFunction) {
			localStorage.setItem('selectedFunction', JSON.stringify(selectedFunction));
			// localStorage.setItem('selectedFunctionParamData', JSON.stringify(paramData));

			// Remove any param form data if function is changed.
			setParamData([]);
		} else {
			localStorage.removeItem('selectedFunction');
			// localStorage.removeItem('selectedFunctionParamData');
		}
	}, [selectedFunction]);

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
	}, [loading, selectedFunction]); // Dependencies to ensure correct behavior

	return (
		<Wrapper title="Sandbox">
			<div className="rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
					<h2 className="text-lg font-semibold whitespace-nowrap flex-none">PHP Functions</h2>
					<div className="ml-auto flex-auto flex w-full space-x-2 sm:justify-end">
						{selectedFunction && selectedFunction.params !== null && (
							<ParamsPopover selectedFunction={selectedFunction} paramData={paramData} updateParams={updateParams}/>
						)}
						<Selector functions={functions} selectedFunction={selectedFunction} setSelectedFunction={setSelectedFunction}/>
						<Button onClick={runFunction} disabled={!selectedFunction}>{loading ? 'Running...' : 'Run Function'}</Button>
					</div>
				</div>
				<Separator/>
			</div>
			{funcResponse && (
				<div className="flex h-full flex-col space-y-4">
					<Textarea
						placeholder="Run a function and see results here..."
						className="min-h-[400px] flex-1 p-4 md:min-h-[700px] lg:min-h-[700px]"
						value={funcResponse}
						readOnly={true}
					/>
				</div>
			)}
		</Wrapper>
	)
}