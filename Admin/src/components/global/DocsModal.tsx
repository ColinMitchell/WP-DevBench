
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {useTheme} from "@/contexts/ThemeContext";

export default function DocsModal() {
    const [open, setOpen] = useState(false);
    const { isDark } = useTheme();

    return (
        <>
            <Button
                variant="ghost"
                onClick={() => setOpen(true)}
                title="Documentation"
                className="gap-2 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Docs</span>
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    className={`max-h-[85vh] max-w-4xl overflow-y-auto ${isDark ? 'dark border-slate-700 bg-slate-900 text-slate-100' : 'border border-slate-200 bg-white text-slate-900'}`}
                >
                    <DialogHeader>
                        <DialogTitle className="dark:text-slate-100">WP-DevBench Documentation</DialogTitle>
                        <DialogDescription className="dark:text-slate-400">
                            Register and execute PHP functions directly from your plugins and themes
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="getting-started" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800">
                            <TabsTrigger value="getting-started" className="dark:text-slate-300 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-slate-100">Getting Started</TabsTrigger>
                            <TabsTrigger value="registration" className="dark:text-slate-300 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-slate-100">Registration</TabsTrigger>
                            <TabsTrigger value="parameters" className="dark:text-slate-300 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-slate-100">Parameters</TabsTrigger>
                            <TabsTrigger value="examples" className="dark:text-slate-300 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-slate-100">Examples</TabsTrigger>
                        </TabsList>

                        {/* GETTING STARTED TAB */}
                        <TabsContent value="getting-started" className="space-y-4">
                            <h3 className="font-semibold text-base dark:text-slate-100">What is WP-DevBench?</h3>
                            <p className="text-sm dark:text-slate-300">
                                WP-DevBench is a developer sandbox that allows you to register and execute custom PHP functions directly from the WordPress admin dashboard. Perfect for testing, debugging, and benchmarking code in your plugins and themes without modifying files.
                            </p>

                            <h3 className="font-semibold text-base mt-4 dark:text-slate-100">Basic Workflow</h3>
                            <ol className="text-sm space-y-2 dark:text-slate-300 list-decimal list-inside">
                                <li><strong>Register</strong> functions using <code className="bg-slate-200 dark:bg-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-xs">DevBench::add_function()</code></li>
                                <li><strong>Select</strong> a function from the dashboard dropdown</li>
                                <li><strong>Configure</strong> any required parameters</li>
                                <li><strong>Execute</strong> and view real-time results</li>
                                <li><strong>Track</strong> execution time and output</li>
                            </ol>
                        </TabsContent>

                        {/* REGISTRATION TAB */}
                        <TabsContent value="registration" className="space-y-4">
                            <h3 className="font-semibold text-base dark:text-slate-100">Registering Functions</h3>
                            <div className="bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded p-3 mt-4">
                                <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1">💡 TIP</p>
                                <p className="text-xs text-blue-800 dark:text-blue-200">
                                    Register functions in your class constructor or via the <code className="bg-white dark:bg-slate-700 dark:text-slate-200 px-1 py-0.5 rounded text-xs">init</code> hook for best results.
                                </p>
                            </div>

                            <h4 className="font-semibold text-sm mt-4 dark:text-slate-100">Method 1: OOP Approach (with Composer)</h4>
                            <p className="text-sm dark:text-slate-300 mb-2">
                                Best for plugin developers using modern PHP practices:
                            </p>
                            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-4 overflow-x-auto">
                                <pre className="text-xs font-mono dark:text-slate-300 text-slate-900">
{`use WP_DevBench\Inc\Services\DevBench;

DevBench::add_function(
    class: get_class( $this ),
    function_name: 'my_function',
    callback: [ $this, 'my_function' ],
    params: [ /* ... */ ],
    description: 'What this function does'
);`}
                                </pre>
                            </div>

                            <h4 className="font-semibold text-sm mt-4 dark:text-slate-100">Method 2: Global Function (No Dependencies)</h4>
                            <p className="text-sm dark:text-slate-300 mb-2">
                                Perfect for simple setups without Composer:
                            </p>
                            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-4 overflow-x-auto">
                                <pre className="text-xs font-mono dark:text-slate-300 text-slate-900">
{`devbench_add_function(
    class: 'my-plugin',
    function_name: 'my_function',
    callback: function() {
        // Your code here
    },
    params: [ /* ... */ ],
    description: 'What this function does'
);`}
                                </pre>
                            </div>

                            <h4 className="font-semibold text-sm mt-4 dark:text-slate-100">Method 3: Action Hook (Recommended for mu-plugins)</h4>
                            <p className="text-sm dark:text-slate-300 mb-2">
                                Most declarative approach using WordPress hooks:
                            </p>
                            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-4 overflow-x-auto">
                                <pre className="text-xs font-mono dark:text-slate-300 text-slate-900">
{`add_action( 'wp_devbench_register_functions', function() {
    devbench_add_function(
        class: 'my-plugin',
        function_name: 'my_function',
        callback: 'my_plugin_callback',
        params: [ /* ... */ ]
    );
} );`}
                                </pre>
                            </div>

                            <h4 className="font-semibold text-base mt-6 dark:text-slate-100">Function Parameters</h4>
                                <h4 className="font-semibold text-sm mt-3 dark:text-slate-100">Required</h4>
                                <ul className="text-sm space-y-2 dark:text-slate-300">
                                    <li><code className="bg-slate-200 dark:bg-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-xs">source</code> - Your class/plugin/theme/file name (string)</li>
                                    <li><code className="bg-slate-200 dark:bg-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-xs">function_name</code> - Method name to execute (string)</li>
                                    <li><code className="bg-slate-200 dark:bg-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-xs">callback</code> - Callable (array, string, or closure)</li>
                                </ul>

                            <h5 className="font-semibold text-sm mt-3 dark:text-slate-100">Optional</h5>
                            <ul className="text-sm space-y-2 dark:text-slate-300">
                                <li><code className="bg-slate-200 dark:bg-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-xs">params</code> - Array of parameter definitions (default: empty)</li>
                                <li><code className="bg-slate-200 dark:bg-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-xs">description</code> - Help text shown in the dashboard (string)</li>
                            </ul>
                        </TabsContent>

                        {/* PARAMETERS TAB */}
                        <TabsContent value="parameters" className="space-y-4">
                            <h3 className="font-semibold text-base dark:text-slate-100">Defining Parameters</h3>
                            <p className="text-sm dark:text-slate-300 mb-3">
                                Parameters use <a href="https://rjsf-team.github.io/react-jsonschema-form/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">JSON Schema</a> format for dynamic form generation.
                            </p>

                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-sm mb-2 dark:text-slate-100">Basic Parameter Structure</h4>
                                    <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-3 overflow-x-auto">
                                        <pre className="text-xs font-mono dark:text-slate-300 text-slate-900">
{`[
    'id'      => 'param_name',
    'type'    => 'string',  // string, number, boolean, integer
    'title'   => 'Field Label',
    'default' => null,      // optional default value
]`}
                                        </pre>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-sm mb-2 dark:text-slate-100">Supported Types</h4>
                                    <div className="text-sm dark:text-slate-300 space-y-1">
                                        <div><code className="bg-slate-200 dark:bg-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-xs">string</code> - Text input field</div>
                                        <div><code className="bg-slate-200 dark:bg-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-xs">number</code> - Numeric input</div>
                                        <div><code className="bg-slate-200 dark:bg-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-xs">integer</code> - Integer input</div>
                                        <div><code className="bg-slate-200 dark:bg-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-xs">boolean</code> - Checkbox toggle</div>
                                        <div><code className="bg-slate-200 dark:bg-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-xs">file</code> - File upload input</div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-sm mb-2 dark:text-slate-100">Select Dropdown</h4>
                                    <p className="text-sm dark:text-slate-300 mb-2">Add <code className="bg-slate-200 dark:bg-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-xs">choices</code> to create a dropdown:</p>
                                    <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-3 overflow-x-auto">
                                        <pre className="text-xs font-mono dark:text-slate-300 text-slate-900">
{`[
    'id'      => 'status',
    'type'    => 'string',
    'title'   => 'Select Status',
    'choices' => [ 'draft', 'publish', 'pending' ],
]`}
                                        </pre>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-sm mb-2 dark:text-slate-100">File Uploads</h4>
                                    <p className="text-sm dark:text-slate-300 mb-2">Use <code className="bg-slate-200 dark:bg-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-xs">type: 'file'</code> to enable file uploads. Files are automatically converted to base64 data URIs and passed to your function.</p>
                                    <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-3 overflow-x-auto mb-3">
                                        <pre className="text-xs font-mono dark:text-slate-300 text-slate-900">
{`[
    'id'      => 'user_file',
    'type'    => 'file',
    'title'   => 'Upload CSV/XML File',
    'default' => null,
    'accept'  => '.csv,.xml'  // Optional: restrict file types
]`}
                                        </pre>
                                    </div>
                                    <div className="bg-yellow-50 dark:bg-slate-800 border border-yellow-200 dark:border-slate-700 rounded p-3">
                                        <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-300 mb-2">📁 FILE UPLOAD DETAILS</p>
                                        <ul className="text-xs text-yellow-800 dark:text-yellow-200 space-y-1">
                                            <li>• <strong>Format:</strong> Files arrive as base64 data URIs (e.g., <code className="bg-white dark:bg-slate-700 dark:text-slate-200 px-1 py-0.5 rounded text-xs">data:text/csv;name=file.csv;base64,ABC123...</code>)</li>
                                            <li>• <strong>Size Limit:</strong> Maximum 10MB per file</li>
                                            <li>• <strong>Accept Attribute:</strong> Use comma-separated extensions like <code className="bg-white dark:bg-slate-700 dark:text-slate-200 px-1 py-0.5 rounded text-xs">.csv,.xlsx,.xml</code></li>
                                            <li>• <strong>Security:</strong> Executable files (.exe, .bat, .sh, etc.) are automatically blocked</li>
                                            <li>• <strong>Processing:</strong> Extract content using <code className="bg-white dark:bg-slate-700 dark:text-slate-200 px-1 py-0.5 rounded text-xs">fopen()</code> or other file functions</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* EXAMPLES TAB */}
                        <TabsContent value="examples" className="space-y-4">
                            <h3 className="font-semibold text-base dark:text-slate-100">Complete Examples</h3>

                            <h4 className="font-semibold text-sm mt-4 dark:text-slate-100">Example 1: Using Global Function</h4>
                            <p className="text-sm dark:text-slate-300 mb-2">
                                Simple registration without Composer requirements:
                            </p>
                            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-4 overflow-x-auto">
                                <pre className="text-xs font-mono dark:text-slate-300 text-slate-900">
{`// In your plugin file
devbench_add_function(
    class: 'my-awesome-plugin',
    function_name: 'clear_cache',
    callback: function() {
        wp_cache_flush();
        return [ 'status' => 'Cache cleared!' ];
    },
    description: 'Clear all WordPress cache'
);

devbench_add_function(
    class: 'my-awesome-plugin',
    function_name: 'get_user_data',
    callback: function( int $user_id ) {
        $user = get_userdata( $user_id );
        return $user ? $user->to_array() : [];
    },
    params: [
        [
            'id'    => 'user_id',
            'type'  => 'number',
            'title' => 'User ID',
        ],
    ],
    description: 'Fetch user information by ID'
);`}
                                </pre>
                            </div>

                            <h4 className="font-semibold text-sm mt-4 dark:text-slate-100">Example 2: OOP Registration</h4>
                            <p className="text-sm dark:text-slate-300 mb-2">
                                Using class methods with DevBench::add_function():
                            </p>
                            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-4 overflow-x-auto">
                                <pre className="text-xs font-mono dark:text-slate-300 text-slate-900">
{`use WP_DevBench\Inc\Services\DevBench;

final class MyPlugin {
    public function __construct() {
        add_action( 'init', [ $this, 'register_devbench' ] );
    }

    public function register_devbench(): void {
        DevBench::add_function(
            class: get_class( $this ),
            function_name: 'get_site_stats',
            callback: [ $this, 'get_site_stats' ],
            params: [],
            description: 'Get overall site statistics'
        );
    }

    public function get_site_stats(): array {
        return [
            'total_posts' => wp_count_posts()->publish,
            'total_users' => count_users()['total_users'],
        ];
    }
}`}
                                </pre>
                            </div>

                            <h4 className="font-semibold text-sm mt-4 dark:text-slate-100">Example 3: With Parameters & Choices</h4>
                            <p className="text-sm dark:text-slate-300 mb-2">
                                Adding dropdown selections and multiple parameters:
                            </p>
                            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-4 overflow-x-auto">
                                <pre className="text-xs font-mono dark:text-slate-300 text-slate-900">
{`devbench_add_function(
    class: 'my-plugin',
    function_name: 'query_posts',
    callback: function( string $status, int $count ) {
        return get_posts( [
            'post_status'    => $status,
            'posts_per_page' => $count,
        ] );
    },
    params: [
        [
            'id'      => 'status',
            'type'    => 'string',
            'title'   => 'Post Status',
            'choices' => [ 'draft', 'publish', 'pending' ],
            'default' => 'publish',
        ],
        [
            'id'      => 'count',
            'type'    => 'number',
            'title'   => 'Number of Posts',
            'default' => 10,
        ],
    ],
    description: 'Query posts by status and count'
);`}
                                </pre>
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </>
    );
}
