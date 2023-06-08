import process from 'node:process';

import dotenv from 'dotenv-safe';

dotenv.config();

import ESB from 'esbuild';
import sassModules from '@squirrelnetwork/esbuild-sass-modules-plugin';

const buildType = process.env['NODE_ENV'];
const isDev = buildType === 'development';
const port = parseInt(process.env['SERVE_PORT']);

const buildOptions =
	{ outfile: 'dist/nebula.js'
	, sourcemap: isDev ? 'inline' : false
	, minify: !isDev
	, format: 'esm'
	, color: true
	, bundle: true
	, logLevel: 'verbose'
	, entryPoints: [ 'src/index.tsx' ]
	, charset: 'utf8'
	, platform: 'browser'
	, target: 'ES6'
	, tsconfig: 'tsconfig.json'
	, define: { 'process.env.NODE_ENV': '"' + buildType + '"' }
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
				, verbose: isDev
				, outFile: 'dist/nebula.css'
				}
			}
		)
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
