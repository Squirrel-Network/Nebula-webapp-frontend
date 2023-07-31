import React, { useEffect, useState } from 'react';
import { map, tap } from 'rxjs';
import FiltersResponse from '../model/filters.response';
import filtersService$ from '../services/filters.service';

export default function useFilters(deps: React.DependencyList) {
	const [filters, setFilters] = useState({} as FiltersResponse);

	const filters$ = filtersService$.get
		.pipe(map(r => r.data))
		.pipe(tap(f => setFilters(f)));

	useEffect(() => {
		const $ = filters$.subscribe();

		return () => $.unsubscribe();
	}, deps);

	return new Map(Object.entries(filters));
};
