/* global __PATH_PREFIX__ */

import React from 'react';
import privateRoute from './components/privateRoute';
import LoginWrapper from './components/LoginWrapper';

// Reference from https://github.com/gatsbyjs/gatsby/blob/ff911e2300/packages/gatsby-plugin-netlify-cms/src/gatsby-browser.js
const routes = /(confirmation|invite|recovery|email_change)_token=([^&]+)/;
const errorRoute = /error=access_denied&error_description=403/;
const accessTokenRoute = /access_token=/;

export const onInitialClientRender = (_, pluginOptions) => {
	const {adminUri} = pluginOptions;
	const enableIdentityWidget = true;

	const hash = (document.location.hash || '').replace(/^#\/?/, '');

	if (
		enableIdentityWidget &&
        (routes.test(hash) ||
            errorRoute.test(hash) ||
            accessTokenRoute.test(hash))
	) {
		import('netlify-identity-widget').then(
			({default: netlifyIdentityWidget}) => {
				netlifyIdentityWidget.on('init', user => {
					if (!user) {
						netlifyIdentityWidget.on('login', () => {
							document.location.href = `${__PATH_PREFIX__}/${adminUri}/`;
						});
					}
				});
				netlifyIdentityWidget.init();
			}
		);
	}
};

exports.wrapPageElement = ({element, props}, pluginOptions) => {
	const {loginUri} = pluginOptions;
	const {netlifyAdminPlugin} = props.pageContext;
	if (netlifyAdminPlugin) {
		if (netlifyAdminPlugin.shouldExclude) {
			return <LoginWrapper element={element}/>;
		}

		return privateRoute({
			component: <LoginWrapper element={element}/>,
			path: props.uri,
			loginUri
		});
	}

	return element;
};
