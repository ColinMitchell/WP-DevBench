import React, {useEffect, useMemo, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Checkbox} from '@/components/ui/checkbox';
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {FormItem} from '@/components/ui/form';
import {ChevronDown, ChevronUp, Settings, AlertCircle} from 'lucide-react';
import {FuncInterface} from '@/types/types';
import {cn} from '@/lib/utils';
import Form from '@rjsf/core';
import {RJSFSchema, UiSchema, WidgetProps} from '@rjsf/utils';
import {noValidator} from '@/utils/noValidator';
import {useToast} from '@/components/ui/use-toast';
import {validateFiles} from "@utils/fileValidator";

interface FunctionParamsProps {
    selectedFunction: FuncInterface | null;
    paramData: any;
    updateParams: (data: any) => void;
    loading: boolean;
    disabled?: boolean;
}

export default function FunctionParams({
                                           selectedFunction,
                                           paramData,
                                           updateParams,
                                           loading,
                                           disabled = false
                                       }: FunctionParamsProps) {

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const {toast} = useToast();

    const hasParamData = formData && Object.keys(formData).length > 0;

    // Update form data when paramData changes (e.g., from history rerun)
    useEffect(() => {
        if (paramData && typeof paramData === 'object') {
            setFormData(paramData);
        }
    }, [paramData]);

    // Create custom widgets for the parameter form
    const widgets = useMemo(
        () => ({
            CheckboxWidget: function (props: WidgetProps) {
                return (
                    <div className="flex items-center space-x-2 mb-4">
                        <Checkbox
                            checked={props.value || false}
                            onCheckedChange={(checked) => props.onChange(checked)}
                            id={props.id}
                            className="dark:border-slate-600 dark:bg-slate-700"
                        />
                        <label htmlFor={props.id} className="text-sm font-medium leading-none dark:text-white">{props.label}</label>
                    </div>
                )
            },
            TextWidget: function (props: WidgetProps) {
                return (
                    <FormItem className="mb-4">
                        <label htmlFor={props.id} className="text-sm font-medium leading-none">{props.label}</label>
                        <Input
                            onChange={e => props.onChange(e.target.value)}
                            value={props.value || ''}
                            id={props.id}
                            className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        />
                    </FormItem>
                );
            },
            SelectWidget: function (props: WidgetProps) {
                const options = props.options?.enumOptions || [];

                return (
                    <FormItem className="mb-4">
                        <label className="text-sm font-medium">{props.label}</label>
                        <Select
                            onValueChange={props.onChange}
                            value={props.value || ''}
                        >
                            <SelectTrigger className="w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                                <SelectValue placeholder="Select an option"/>
                            </SelectTrigger>
                            <SelectContent className="dark:bg-slate-700 dark:border-slate-600">
                                <SelectGroup>
                                    {options.map((option: any, index: number) => (
                                        <SelectItem key={index} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </FormItem>
                );
            }
        }),
        []
    );

    const schema: RJSFSchema | null = selectedFunction?.params || null;

    const uiSchema: UiSchema = {
        'ui:globalOptions': {
            label: false
        },
        'ui:submitButtonOptions': {
            props: {
                disabled: false,
            },
            norender: true,
        },
    };

    const handleFormChange = (e: any) => {
        // Validate files before updating state
        const validationResult = validateFiles(e.formData, schema);

        if (!validationResult.valid) {
            // Show error toast
            toast({
                title: "File Upload Error",
                description: (
                    <div className="flex flex-col gap-1">
                        {validationResult.errors.map((err, idx) => (
                            <span key={idx} className="flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                {err.message}
                            </span>
                        ))}
                    </div>
                ),
                variant: "destructive",
                duration: 5000,
            });

            // Reset the file field to remove the filename display
            // Find the key that contains the invalid file
            const updatedFormData = {...formData};
            Object.keys(e.formData).forEach(key => {
                const value = e.formData[key];
                if (typeof value === 'string' && value.startsWith('data:')) {
                    // Keep the old value (or empty string if none exists)
                    if (!formData[key] || !formData[key].startsWith('data:')) {
                        updatedFormData[key] = '';
                    }
                }
            });

            setFormData(updatedFormData);
            updateParams(updatedFormData);
            return;
        }

        setFormData(e.formData);
        updateParams(e.formData);
    };

    /**
     * Filters the formData shown to the user and checks if it has file data and just returns the filename.
     *
     * @param {any} formData
     * @returns {string}
     */
    const filterDisplayFormData = (formData: any): string => {
        return JSON.stringify(formData, (key, value) => {
            if (typeof value === 'string' && value.includes('data:') && value.includes(';name=')) {
                const match = value.match(/;name=([^;]+)/);
                return match ? match[1] : value;
            }
            return value;
        }, 2);
    }

    return (
        <Card className={cn("w-full dark:bg-slate-900 dark:border-slate-800", disabled && "opacity-50 pointer-events-none")}>
            <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center dark:text-white">
                        <Settings className="w-5 h-5 mr-2"/>
                        Parameters
                        {disabled && <span className="text-sm text-muted-foreground ml-2">(Function Running...)</span>}
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="h-8 w-8 p-0"
                        disabled={disabled}
                    >
                        {isCollapsed ? (
                            <ChevronDown className="w-4 h-4"/>
                        ) : (
                            <ChevronUp className="w-4 h-4"/>
                        )}
                    </Button>
                </div>
            </CardHeader>

            <CardContent
                className={cn(
                    "pt-0 transition-all duration-200 ease-in-out ",
                    isCollapsed ? "max-h-0 overflow-hidden pb-0" : "max-h-96 overflow-y-auto"
                )}
            >
                <div className="space-y-4">
                    <div className="space-y-4 ">
                        {schema && (
                            <div className="border rounded-lg p-4 dark:bg-slate-800">
                                <div className="flex gap-4 h-full">
                                    {/* Left Side - Form inputs (70%) */}
                                    <div className="flex-[0.7]">
                                        <Form
                                            schema={schema}
                                            validator={noValidator}
                                            onChange={handleFormChange}
                                            uiSchema={uiSchema}
                                            widgets={widgets}
                                            formData={formData}
                                        />
                                    </div>

                                    {hasParamData && (
                                        <div className="flex-[0.3]">
                                            <div className="bg-muted rounded-lg p-3 h-fit sticky top-0">
                                                <h4 className="text-sm font-medium mb-2">Current Parameters:</h4>
                                                <pre
                                                    className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                                                    {filterDisplayFormData(formData)}
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        { !schema && (
                            <div className="border rounded-lg p-6 dark:bg-slate-800 border-blue-200 dark:border-blue-900/30 bg-slate-30 dark:bg-blue-950/20">
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-slate-800 dark:text-blue-200">
                                        This function doesn't require any parameters. See the docs for how to add parameters.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
