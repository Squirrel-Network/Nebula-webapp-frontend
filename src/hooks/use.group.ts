import React, { useEffect, useState } from 'react';

import { map, tap } from 'rxjs';

import Group from '../model/group';
import GroupService from '../services/group.service';

export default function useGroup(id: string, deps: React.DependencyList) {
	const [ groupInfo, updateGroupInfo ] = useState(new Group());

	useEffect(() => {
		const groupInfo$ = GroupService.get$(id)
			.pipe(map(r => Group.from(r.data)))
			.pipe(tap(updateGroupInfo));

		const $ = groupInfo$.subscribe();

		return () => $.unsubscribe();
	}, deps);

	return groupInfo;
};
