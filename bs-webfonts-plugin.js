import path from 'path';
import { lookInYarnZipFS } from './Gulpfile.utils.js';

export default (
	{ name: 'squirrelnetwork:bs-webfonts-plugin'
	, setup(build) {
		build.onResolve(
			{ filter: /bootstrap-icons\.(?:woff|ttf|otf)/
			, namespace: 'squirrelnetwork:sass-modules-plugin'
			},
			args => (
				{ path: path.join('bootstrap-icons/font/', args.path)
				, namespace: 'squirrelnetwork:bs-webfonts-plugin'
				, pluginData: { importer: args.importer }
				}
			)
		);

		build.onLoad(
			{ filter: /bootstrap-icons\.(?:woff|ttf|otf)/
			, namespace: 'squirrelnetwork:bs-webfonts-plugin'
			},
			args => {

			const contents = lookInYarnZipFS(
				'~bootstrap-icons/font/fonts/bootstrap-icons',
				args.pluginData.importer,
				['.woff2', '.woff', '.otf', '.ttf']
			);

			return (
				{ contents
				, loader: 'dataurl'
				}
			);
		});
	}
	}
);
