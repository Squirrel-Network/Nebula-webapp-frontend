import GetGroupInfo from './get.group.info';
import Language from './language';

export default class Group {
	chatId: number;
	name: string;
	language: Language;
	maxWarn: number;
	totalUsers: number;
	totalMessages: number;
	photo: string;

	constructor(info?: GetGroupInfo) {
		this.chatId = info?.chat_id;
		this.name = info?.group_name;
		this.language = info?.language;
		this.maxWarn = info?.max_warn;
		this.totalMessages = info?.total_messages;
		this.totalUsers = info?.total_users;
		this.photo = info?.group_photo;
	}

	static from(info: GetGroupInfo) {
		return new Group(info);
	}

	toJSON(): object {
		return (
			{ group_photo: this.photo
			, total_users: this.totalUsers
			, total_messages: this.totalMessages
			, max_warn: this.maxWarn
			, language: this.language
			, group_name: this.name
			, chat_id: this.chatId
			} as GetGroupInfo
		);
	}
};
