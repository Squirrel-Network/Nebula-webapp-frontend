import path from 'path';
import { fileURLToPath } from 'url';

import pnpapi from 'pnpapi';
import { PosixFS } from '@yarnpkg/fslib';
import libzip from '@yarnpkg/libzip';

const sassImportStack = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const identity = x => x;

const maybe = op => function may(ok, fail) {
	try {
		const res = op();

		return ok(res);
	}
	catch(e) {
		return fail(e);
	}
};

function getTildeLoaderPnPResource(url, prev) {
	function recurse(module) {
		const oldPrev = sassImportStack.at(-2);
		sassImportStack.pop();

		return getTildeLoaderPnPResource(module, oldPrev);
	}

	if(url.startsWith('~')) {
		url = url.substring(1);
	}

	if(prev.startsWith('~')) {
		url = path.dirname(prev.substring(1))
			+ '/'
			+ url;
	}

	const sassExtensions = ['.sass', '.scss'];

	const maybeResource = maybe(() =>
		pnpapi.resolveRequest(
			url,
			__dirname + '/',
			{ extensions: sassExtensions
			}
		)
	);

	const maybeUnderscore = maybe(() =>
		pnpapi.resolveRequest(
			path.dirname(url)
				+ '/_'
				+ path.basename(url),
			__dirname + '/',
			{ extensions: sassExtensions
			}
		)
	);

	return maybeResource(
		identity,
		() => maybeUnderscore(
			identity,
			() => recurse(url)
		)
	);
}

export function tildeLoader(module, importer) {
	if(!module.startsWith('~') && sassImportStack.length === 0) {
		return null;
	}

	const zipOpenFs = new libzip.ZipOpenFS(
		{ libzip: libzip.getLibzipSync()
		}
	);
	const crossFs = new PosixFS(zipOpenFs);

	if(sassImportStack.indexOf(importer) === -1) {
		sassImportStack.push(importer);
	}

	const resource = getTildeLoaderPnPResource(module, importer);
	const file = crossFs.readFileSync(resource);

	return { contents: file.toString() };
}
