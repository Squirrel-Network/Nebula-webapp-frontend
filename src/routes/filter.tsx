import React from 'react';
import useFilters from '../hooks/use.filters';

export default function RouteFilter() {
	const filters = useFilters([]);

	return <>{JSON.stringify(filters)}</>;
}
