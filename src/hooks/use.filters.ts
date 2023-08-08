import React, { useEffect, useState } from 'react';

import { map, Subject, switchMap, tap } from 'rxjs';

import GetGroupFilters from '../model/get.group.filters';
import GroupFilters from '../model/group.filters';
import FiltersService from '../services/filters.service';

export default function useFilters(deps: React.DependencyList) {
	const [ filters, updateFilters ] = useState(new GroupFilters());
	const [ actionUpdate$ ] = useState(new Subject<GroupFilters>());

	useEffect(() => {
		const filters$ = FiltersService.get$
			.pipe(map(r => GroupFilters.fromObject(r.data)))
			.pipe(tap(updateFilters));

		const $filters = filters$.subscribe();
		const $actionUpdate = actionUpdate$
			.pipe(map(f => f.toJSON() as GetGroupFilters))
			.pipe(switchMap(FiltersService.post$))
			.subscribe();

		return () => ($filters.unsubscribe(), $actionUpdate.unsubscribe());
	}, deps);

	const filtersMap = filters.getMap();
	const update = (filters: GroupFilters) => actionUpdate$.next(filters);

	return [ filtersMap, update ] as [ typeof filtersMap, typeof update ];
};
