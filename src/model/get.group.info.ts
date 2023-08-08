import Language from './language';

type GetGroupInfo =
	{ readonly chat_id: number
	, readonly group_name: string
	, readonly language: Language
	, readonly max_warn: number
	, readonly total_users: number
	, readonly total_messages: number
	, readonly group_photo: string
	};

export default GetGroupInfo;
