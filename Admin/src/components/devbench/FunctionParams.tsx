import React, {useState, useMemo, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Checkbox} from '@/components/ui/checkbox';
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {FormItem} from '@/components/ui/form';
import {ChevronDown, ChevronUp, Code2, Play, Settings} from 'lucide-react';
import {FuncInterface} from '@/types/types';
import {cn} from '@/lib/utils';
import Form from '@rjsf/core';
import {RJSFSchema, UiSchema, WidgetProps} from '@rjsf/utils';
import {noValidator} from '@/utils/noValidator';

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
        setFormData(e.formData);
        updateParams(e.formData);
    };

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
                                                    {JSON.stringify(formData, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
