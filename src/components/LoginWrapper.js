import React, {useState} from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import {isLoggedIn as isLoggedInFn, getCurrentUser} from '../utils/auth';

netlifyIdentity.init();

const LoginWrapper = ({element}) => {
	const [user, setUser] = useState(getCurrentUser());
	const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInFn());
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [error, setError] = useState('');

	netlifyIdentity.on('init', () => setIsLoggedIn(isLoggedInFn()));
	netlifyIdentity.on('login', currentUser => {
		setUser(currentUser);
		setIsLoggedIn(true);
	});
	netlifyIdentity.on('logout', () => setIsLoggedIn(false));
	netlifyIdentity.on('error', err => setError(err));
	netlifyIdentity.on('open', () => setIsModalOpen(true));
	netlifyIdentity.on('close', () => setIsModalOpen(false));

	function login() {
		netlifyIdentity.open();
	}

	function logout() {
		netlifyIdentity.logout();
	}

	const ele = React.cloneElement(element, {
		netlifyLogin: login,
		netlifyLogout: logout,
		netlifyAdminStatus: {
			user,
			isLoggedIn,
			isModalOpen,
			error
		}
	});
	return ele;
};

export default LoginWrapper;
