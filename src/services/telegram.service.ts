const TELEGRAM_SECRETS_MAP = new Map<string, any>();
TELEGRAM_SECRETS_MAP.set('initData', Telegram.WebApp.initData);
TELEGRAM_SECRETS_MAP.set('params', new URLSearchParams(location.search));

const TelegramService =
	{ get initData() {
		return TELEGRAM_SECRETS_MAP.get('initData') as string;
	}
	, get jwt() {
		return (TELEGRAM_SECRETS_MAP.get('params') as URLSearchParams)
			.get('token');
	}
	, get chatId() {
		return (TELEGRAM_SECRETS_MAP.get('params') as URLSearchParams)
			.get('chat_id');
	}
	};

export default TelegramService;
