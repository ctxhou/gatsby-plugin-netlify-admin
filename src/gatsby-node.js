const path = require('path');
const globCB = require('glob');
const Promise = require('bluebird');
const {
	createPath,
	validatePath,
	ignorePath
} = require('gatsby-page-utils');

const {defaultAdminUri} = require('./utils/config');

const glob = Promise.promisify(globCB);

const createPathWithAdminURI = (adminUri, filePath) =>
	path.posix.join('/', adminUri, createPath(filePath));
const isIndexPage = (adminUri, pagePath) => pagePath === `/${adminUri}/`;

exports.onPreInit = ({reporter}, options) => {
	if (!options.adminPath) {
		reporter.panic(
			'"adminPath" is required.'
		);
	}

	if (!options.adminUri) {
		options.adminUri = defaultAdminUri;
		reporter.warn(
			`"adminUri" is undefined. Use ${defaultAdminUri} as default admin URI`
		);
	}

	if (!options.loginUri) {
		options.loginUri = createPathWithAdminURI(options.adminUri, '/');
		reporter.warn(
			`"loginUri" is undefined. Will fallback to root adminUri as the default login path: ${options.loginUri}`
		);
	}

	if (!options.excludeUri) {
		options.excludeUri = [];
	}

	options.excludeUri.push(options.loginUri);
};

exports.onCreateWebpackConfig = ({stage, loaders, actions}) => {
	if (stage === 'build-html') {
		actions.setWebpackConfig({
			module: {
				rules: [
					{
						test: /netlify-identity-widget/,
						use: loaders.null()
					}
				]
			}
		});
	}
};

exports.createPagesStatefully = async (
	{actions, store},
	pluginOptions,
	doneCb
) => {
	const {adminUri, adminPath, ignore, excludeUri} = pluginOptions;
	const {createPage} = actions;
	const {program} = store.getState();
	const exts = program.extensions.map(ext => `${ext.slice(1)}`).join(',');
	const adminDir = path.resolve(process.cwd(), adminPath);
	const pagesGlob = `**/*.{${exts}}`;

	const files = await glob(pagesGlob, {cwd: adminPath});

	files.forEach(filePath => {
		if (!validatePath(filePath)) {
			return;
		}

		// Filter out anything matching the given ignore patterns and options
		if (ignorePath(filePath, ignore)) {
			return;
		}

		const pagePath = createPathWithAdminURI(adminUri, filePath);

		createPage({
			path: pagePath,
			component: path.join(adminDir, filePath),
			matchPath: isIndexPage(adminUri, pagePath) ? `${pagePath}*` : '',
			context: {
				netlifyAdminPlugin: {
					shouldExclude: excludeUri.includes(pagePath)
				}
			}
		});
	});

	doneCb();
};
