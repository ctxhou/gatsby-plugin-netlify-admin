import netlifyIdentity from 'netlify-identity-widget';

if (typeof window !== 'undefined') {
	window.netlifyIdentity = netlifyIdentity;
}

export const isLoggedIn = () => {
	const user = netlifyIdentity.currentUser();
	return Boolean(user);
};

export const getCurrentUser = () => {
	return netlifyIdentity.currentUser();
};
