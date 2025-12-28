const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry,
		devbench: path.resolve(process.cwd(), 'Admin/src/devbench', 'index.tsx'),
		editor: path.resolve(process.cwd(), 'Admin/src', 'editor.ts'),
		'dark-mode-wp-sync': path.resolve(process.cwd(), 'Admin/src', 'dark-mode-wp-sync.ts'),
		'globals': path.resolve(process.cwd(), 'Admin/src', 'globals.css'),
	},
	watchOptions: {
		aggregateTimeout: 300,
		poll: 1000,
	},
	resolve: {
		...defaultConfig.resolve,
		alias: {
			...defaultConfig.resolve.alias,
			// add as many aliases as you like!
			'@': path.resolve(__dirname, './Admin/src'),
			'@components': path.resolve(__dirname, './Admin/src/components'),
			'@lib': path.resolve(__dirname, './Admin/src/lib'),
			'@pages': path.resolve(__dirname, './Admin/src/pages'),
			'@types': path.resolve(__dirname, './Admin/src/types'),
			'@utils': path.resolve(__dirname, './Admin/src/utils'),
			'@assets': path.resolve(__dirname, './Admin/src/assets'),
		},
	}

};
