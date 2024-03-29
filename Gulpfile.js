import dotenv from 'dotenv-safe';

const { required: env } = dotenv.config();

import ESB from 'esbuild';
import sassModules from '@squirrelnetwork/esbuild-sass-modules-plugin';
import { tildeLoader } from './Gulpfile.utils.js';
import BsWebfontsPlugin from './bs-webfonts-plugin.js';

const buildType = env['NODE_ENV'];
const isDev = buildType === 'development';
const port = parseInt(env['SERVE_PORT']);
const bundleName = env['BUNDLE_NAME'];
const logLevel = env['LOG_LEVEL'];

const buildOptions =
	{ outfile: `dist/${bundleName}.js`
	, sourcemap: isDev ? 'inline' : false
	, minify: !isDev
	, format: 'esm'
	, color: true
	, bundle: true
	, logLevel: logLevel
	, entryPoints: [ 'src/index.tsx' ]
	, charset: 'utf8'
	, platform: 'browser'
	, target: 'ES6'
	, tsconfig: 'tsconfig.json'
	, define: Object.keys(env)
		.reduce((acc, next) => (
			{ ...acc
			, [`process.env.${next}`]: `"${env[next]}"`
			}
			),
			{}
		)
	, plugins:
		[ sassModules(
			{ postcss:
				{ use: true
				}
			, sass:
				{ outputStyle: isDev ? 'expanded' : 'compressed'
				, sourceMap: isDev
				, sourceMapEmbed: isDev
				, sourceMapContents: isDev
				, verbose: logLevel
				, outFile: `dist/${bundleName}.css`
				, importer:
					[ tildeLoader
					]
				}
			}
		)
		, BsWebfontsPlugin
		]
	};

const ctx$ = () => ESB.context(buildOptions);

export async function build() {
	return ESB.build(buildOptions);
}

export async function watch() {
	return ctx$().then(C => C.watch());
}

export async function serve() {
	return ctx$()
		.then(C => C.serve({ port, servedir: 'dist/' }));
}
