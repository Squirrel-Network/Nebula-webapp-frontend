import { createRoot } from 'react-dom/client';
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import Router from './router';

window.addEventListener('load', () => {
	const main = document.querySelector('main');
	const root = createRoot(main);

	root.render(
		<React.StrictMode>
			<RouterProvider router={ Router } />
		</React.StrictMode>
	);
});
