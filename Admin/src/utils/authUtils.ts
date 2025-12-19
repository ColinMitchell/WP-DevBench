export const isAuthorized = (allowedRoles: string[]) => {
	const userRole = window.wpDevBench.userRole;
	return allowedRoles.includes(userRole);
};