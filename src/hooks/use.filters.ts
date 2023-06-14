import { useEffect, useState } from 'react';
import { map, tap } from 'rxjs';
import FiltersResponse from '../model/filters.response';
import filtersService$ from '../services/filters.service';

export default function useFilters() {
	const [filters, setFilters] = useState({} as FiltersResponse);

	const filters$ = filtersService$
		.pipe(map(r => r.data));

	useEffect(() => {
		const $ = filters$
			.pipe(tap(f => setFilters(f)))
			.subscribe();

		return () => $.unsubscribe();
	}, [filters$, setFilters]);

	return filters;
};
