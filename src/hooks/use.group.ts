import { useEffect, useState } from 'react';
import { map, tap } from 'rxjs';
import Group from '../model/group';
import GroupService from '../services/group.service';

export default function useGroup(id: string) {
	const [groupInfo, updateGroupInfo] = useState({} as Group);

	const groupInfo$ = GroupService.get(id)
		.pipe(map(r => Group.from(r.data)))
		.pipe(tap(updateGroupInfo));

	useEffect(() => {
		const $ = groupInfo$.subscribe();

		return () => $.unsubscribe();
	});

	return groupInfo;
};
