/**
 * Sync WordPress admin #wpwrap with dark mode theme
 */
(function (): void {
	const wpwrap = document.getElementById("wpwrap");

	if (!wpwrap) {
		return;
	}

	// Function to sync dark mode
	const syncDarkMode = (targetElement: Element): void => {
		const isDarkMode = targetElement.classList.contains("dark");

		if (isDarkMode) {
			wpwrap.classList.add("dark");
		} else {
			wpwrap.classList.remove("dark");
		}
	};

	// Try to find your React app container
	// Adjust this selector to match YOUR React app's root element
	const reactAppContainer = document.querySelector<HTMLElement>("#wp-devbench > div");

	if (reactAppContainer) {
		// Initial sync
		syncDarkMode(reactAppContainer);

		// Watch for class changes on the React container
		const observer = new MutationObserver((mutations: MutationRecord[]) => {
			mutations.forEach((mutation) => {
				if (mutation.type === "attributes" && mutation.attributeName === "class") {
					syncDarkMode(mutation.target as Element);
				}
			});
		});

		observer.observe(reactAppContainer, {
			attributes: true,
			attributeFilter: ["class"],
		});
	} else {
		// Fallback: Watch the entire wpwrap for any .dark class additions
		const observer = new MutationObserver(() => {
			const darkElement = document.querySelector<HTMLElement>("#wpwrap .dark");
			if (darkElement && darkElement !== wpwrap) {
				wpwrap.classList.add("dark");
			} else if (!darkElement) {
				wpwrap.classList.remove("dark");
			}
		});

		observer.observe(wpwrap, {
			subtree: true,
			attributes: true,
			attributeFilter: ["class"],
		});
	}
})();
