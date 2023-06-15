import React from 'react';

import { createBrowserRouter } from 'react-router-dom';
import RouteError from './routes/error';
import RouteFilters from './routes/filters';
import RouteHome from './routes/home';

export default createBrowserRouter(
	[ { path: '/'
	, element: <RouteHome />
	}
	, { path: '/filters'
	, element: <RouteFilters />
	}
	, { path: '/error'
	, element: <RouteError />
	}
	]
);
