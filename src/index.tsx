import { createRoot } from 'react-dom/client';
import React from 'react';

import Test from './components/test';

window.addEventListener('load', () => {
	const main = document.querySelector('main');
	const root = createRoot(main);

	root.render(
		<React.StrictMode>
			<Test />
		</React.StrictMode>
	);
});
