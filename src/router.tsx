import React from 'react';

import { createBrowserRouter } from 'react-router-dom';
import RouteError from './routes/error';
import RouteFilter from './routes/filter';
import RouteHome from './routes/home';

export default createBrowserRouter(
	[ { path: '/'
	, element: <RouteHome />
	}
	, { path: '/filters'
	, element: <RouteFilter />
	}
	, { path: '/error'
	, element: <RouteError />
	}
	]
);
