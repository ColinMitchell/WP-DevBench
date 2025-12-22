import React, {useState, useMemo} from 'react';
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
    paramData: any[];
    updateParams: (data: any) => void;
    onRun: () => void;
    loading: boolean;
}

export default function FunctionParams({
                                           selectedFunction,
                                           paramData,
                                           updateParams,
                                           onRun,
                                           loading
                                       }: FunctionParamsProps) {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const hasParamData = paramData && Object.keys(paramData).length > 0;

    // Create custom widgets for the parameter form
    const widgets = useMemo(
        () => ({
            CheckboxWidget: function (props: WidgetProps) {
                return (
                    <div className="flex items-center space-x-2 mb-4">
                        <Checkbox checked={props.value} onCheckedChange={props.onChange} value={props.value}
                                  id={props.id}/>
                        <label htmlFor={props.id} className="text-sm font-medium leading-none">{props.label}</label>
                    </div>
                )
            },
            TextWidget: function (props: WidgetProps) {
                return (
                    <FormItem className="mb-4">
                        <label htmlFor={props.id} className="text-sm font-medium leading-none">{props.label}</label>
                        <Input onChange={e => props.onChange(e.target.value)} value={props.value} id={props.id}/>
                    </FormItem>
                );
            },
            SelectWidget: function (props: WidgetProps) {
                const options = props.options?.enumOptions || [];

                return (
                    <FormItem className="mb-4">
                        <label className="text-sm font-medium">{props.label}</label>
                        <Select onValueChange={props.onChange} value={props.value}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an option"/>
                            </SelectTrigger>
                            <SelectContent>
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

    return (
        <Card className="w-full">
            <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                        <Settings className="w-5 h-5 mr-2"/>
                        Parameters
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="h-8 w-8 p-0"
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
                    "pt-0 transition-all duration-200 ease-in-out",
                    isCollapsed ? "max-h-0 overflow-hidden pb-0" : "max-h-96 overflow-y-auto"
                )}
            >
                <div className="space-y-4">
                    <div className="space-y-4">
                        {/*<div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                                    <Code2 className="w-4 h-4 text-primary"/>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-foreground">
                                        {selectedFunction.class}::{selectedFunction.funcName}()
                                    </div>
                                </div>
                            </div>
                        </div>*/}

                        {schema && (
                            <div className="border rounded-lg p-4 bg-background">
                                <div className="flex gap-4 h-full">
                                    {/* Left Side - Form inputs (70%) */}
                                    <div className="flex-1" style={{ flexBasis: '70%' }}>
                                        <Form
                                            schema={schema}
                                            validator={noValidator}
                                            onChange={(e) => updateParams(e.formData)}
                                            uiSchema={uiSchema}
                                            widgets={widgets}
                                            formData={paramData}
                                        />
                                    </div>

                                    {/* Right Side - Current Parameters (30%) */}
                                    {hasParamData && (
                                        <div className="flex-shrink-0" style={{ flexBasis: '30%' }}>
                                            <div className="bg-muted rounded-lg p-3 h-fit sticky top-0">
                                                <h4 className="text-sm font-medium mb-2">Current Parameters:</h4>
                                                <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                                                            {JSON.stringify(paramData, null, 2)}
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
