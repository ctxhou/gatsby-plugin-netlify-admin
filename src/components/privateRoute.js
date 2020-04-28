import {navigate} from 'gatsby';
import {isLoggedIn} from '../utils/auth';

const privateRoute = ({component, path, loginUri}) => {
	if (!isLoggedIn() && path !== loginUri) {
		navigate(loginUri);
		return null;
	}

	return component;
};

export default privateRoute;
