import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';

import { catchError, map, Subject, switchMap, tap } from 'rxjs';

import GetGroupFilters from '../model/get.group.filters';
import GroupFilters from '../model/group.filters';
import FiltersService from '../services/filters.service';

export default function useFilters(
	{ onStart
	, onComplete
	, onError
	}: { onStart: (f: GetGroupFilters) => void
		, onComplete: (r: AxiosResponse) => void
		, onError: (e: AxiosError) => void
		},
	deps: React.DependencyList
) {
	const [ filters, updateFilters ] = useState(new GroupFilters());
	const [ actionUpdate$ ] = useState(new Subject<GroupFilters>());

	useEffect(() => {
		const filters$ = FiltersService.get$
			.pipe(map(r => GroupFilters.fromObject(r.data)))
			.pipe(tap(updateFilters));

		const $filters = filters$.subscribe();
		const $actionUpdate = actionUpdate$
			.pipe(tap(updateFilters))
			.pipe(map(f => f.toJSON() as GetGroupFilters))
			.pipe(tap(onStart))
			.pipe(switchMap(FiltersService.post$))
			.pipe(catchError((e: AxiosError, $) => (onError(e), $)))
			.subscribe(onComplete);

		return () => ($filters.unsubscribe(), $actionUpdate.unsubscribe());
	}, deps);

	const filtersMap = filters.getMap();
	const update = (filters: GroupFilters) => actionUpdate$.next(filters);

	return [ filtersMap, update ] as [ typeof filtersMap, typeof update ];
};
