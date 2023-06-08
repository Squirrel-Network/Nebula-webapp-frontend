import { createRoot } from 'react-dom/client';
import React from 'react';

window.addEventListener('load', () => {
	const main = document.querySelector('main');
	const root = createRoot(main);

	root.render(
		<React.StrictMode>

		</React.StrictMode>
	);
});
