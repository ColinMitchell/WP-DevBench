/**
 * Sync WordPress admin #wpwrap with dark mode theme
 */
(function (): void {
	const wpwrap = document.getElementById("wpwrap");
	const appRoot = document.getElementById("wp-devbench");

	if (!wpwrap || !appRoot) {
		return;
	}

	let lastState: boolean | null = null;

	const syncDarkMode = (sourceElement: Element): void => {
		const shouldBeDark = sourceElement.classList.contains("dark");

		if (shouldBeDark === lastState && wpwrap.classList.contains("dark") === shouldBeDark) {
			return;
		}

		lastState = shouldBeDark;
		wpwrap.classList.toggle("dark", shouldBeDark);
	};

	const observeDashboard = (dashboard: HTMLElement): void => {
		syncDarkMode(dashboard);

		const dashboardObserver = new MutationObserver((mutations: MutationRecord[]) => {
			mutations.forEach((mutation) => {
				if (mutation.type === "attributes" && mutation.attributeName === "class") {
					syncDarkMode(dashboard);
				}
			});
		});

		dashboardObserver.observe(dashboard, {
			attributes: true,
			attributeFilter: ["class"],
		});
	};

	const existingDashboard = document.getElementById("wp-devbench-dashboard");

	if (existingDashboard) {
		observeDashboard(existingDashboard);
		return;
	}

	const waitForDashboard = new MutationObserver(() => {
		const dashboard = document.getElementById("wp-devbench-dashboard");

		if (!dashboard) {
			return;
		}

		waitForDashboard.disconnect();
		observeDashboard(dashboard);
	});

	waitForDashboard.observe(appRoot, {
		childList: true,
		subtree: true,
	});
})();
