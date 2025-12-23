/**
 * Sync WordPress admin #wpwrap with dark mode theme
 */
(function() {
	const wpwrap = document.getElementById('wpwrap');

	if (!wpwrap) {
		console.warn('wpwrap not found');
		return;
	}

	// Function to sync dark mode
	const syncDarkMode = (targetElement) => {
		const isDarkMode = targetElement.classList.contains('dark');

		if (isDarkMode) {
			wpwrap.classList.add('dark');
			console.log('Dark mode enabled on wpwrap');
		} else {
			wpwrap.classList.remove('dark');
			console.log('Dark mode disabled on wpwrap');
		}
	};

	// Try to find your React app container
	// Adjust this selector to match YOUR React app's root element
	const reactAppContainer = document.querySelector('#wp-devbench > div');

	if (reactAppContainer) {
		console.log('Watching element:', reactAppContainer);

		// Initial sync
		syncDarkMode(reactAppContainer);

		// Watch for class changes on the React container
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
					syncDarkMode(mutation.target);
				}
			});
		});

		observer.observe(reactAppContainer, {
			attributes: true,
			attributeFilter: ['class']
		});
	} else {
		console.warn('React app container not found. Add specific selector.');

		// Fallback: Watch the entire wpwrap for any .dark class additions
		const observer = new MutationObserver(() => {
			const darkElement = document.querySelector('#wpwrap .dark');
			if (darkElement && darkElement !== wpwrap) {
				wpwrap.classList.add('dark');
			} else if (!darkElement) {
				wpwrap.classList.remove('dark');
			}
		});

		observer.observe(wpwrap, {
			subtree: true,
			attributes: true,
			attributeFilter: ['class']
		});
	}
})();
