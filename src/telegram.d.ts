declare namespace Telegram {
	type WebAppUser =
		{ readonly id: number
		, readonly is_bot?: boolean
		, readonly first_name: string
		, readonly last_name?: string
		, readonly username?: string
		, readonly language_code?: string
		, readonly is_premium?: true
		, readonly photo_url?: string
		};

	type WebAppChat =
		{ readonly id: number
		; readonly type: string
		, readonly title: string
		, readonly username?: string
		, readonly photo_url?: string
		};

	type PrivateLinkChatType = 'sender';

	type UserChatType =
		'private'
		| 'group'
		| 'supergroup'
		| 'channel'
		;

	type WebAppInitData =
		{ readonly query_id?: string
		, readonly user?: WebAppUser
		, readonly receiver?: WebAppUser
		, readonly chat?: WebAppChat
		, readonly chat_type?: PrivateLinkChatType | UserChatType
		, readonly chat_instance?: string
		, readonly start_param?: string
		, readonly can_send_after?: number
		, readonly auth_date: number
		, readonly hash?: string
		};

	type WebAppColorScheme =
		'light'
		| 'dark';

	type WebAppThemeParams =
		{ readonly bg_color?: string
		, readonly text_color?: string
		, readonly hint_color?: string
		, readonly link_color?: string
		, readonly button_color?: string
		, readonly button_text_color?: string
		, readonly secondary_bg_color?: string
		};

	interface BackButton {
		isVisible: boolean;
		onClick(callback: Function): void;
		offClick(callback: Function): void;
		show(): void;
		hide(): void;
	}

	type MainButtonParams =
		{ readonly text: string
		, readonly color: string
		, readonly text_color: string
		, readonly is_active: boolean
		, readonly is_visible: boolean
		};

	interface MainButton {
		text: string;
		color: string;
		textColor: string;
		isVisible: boolean;
		isActive: boolean;
		readonly isProgressVisible: boolean;
		setText(text: string): void;
		onClick(callback: Function): void;
		offClick(callback: Function): void;
		show(): void;
		hide(): void;
		enable(): void;
		disable(): void;
		showProgress(leaveActive?: boolean): void;
		hideProgress(): void;
		setParams(params: MainButtonParams): void;
	}

	type HapticFeedbackImpactStyle =
		'light'
		| 'medium'
		| 'heavy'
		| 'rigid'
		| 'soft'
		;

	type HapticFeedbackNotificationType =
		'error'
		| 'success'
		| 'warning'
		;

	interface HapticFeedback {
		impactOccurred(style: HapticFeedbackImpactStyle): void;
		notificationOccurred(type: HapticFeedbackNotificationType): void;
		selectionChanged();
	}

	type WebAppColorKeywords =
		'bg_color'
		| 'secondary_bg_color'
		;

	type WebAppEventType =
		'themeChanged'
		| 'viewportChanged'
		| 'mainButtonClicked'
		| 'backButtonClicked'
		| 'settingsButtonClicked'
		| 'invoiceClosed'
		| 'popupClosed'
		| 'qrTextReceived'
		| 'clipboardTextReceived'
		;

	type EventViewportChangedData =
		{ readonly isStateStable: boolean
		};

	type EventInvoiceClosedData =
		{ readonly url: string
		, readonly status:
			'paid'
			| 'cancelled'
			| 'failed'
			| 'pending'
		};

	type EventPopupClosedData =
		{ button_id: string | null
		};

	type EventQrTextReceivedData =
		{ data: string
		};

	type EventClipboardTextReceivedData =
		{ data: string | null
		};

	type InlineQueryChatType =
		'users'
		| 'bots'
		| 'groups'
		| 'channels'
		;

	type PopupButtonType =
		'default'
		| 'ok'
		| 'close'
		| 'cancel'
		| 'destructive'
		;

	type PopupButton =
		{ readonly id?: string
		, readonly type?: PopupButtonType
		, readonly text?: string
		};

	type PopupParams =
		{ readonly title?: string
		, readonly message: string
		, readonly buttons?: Array<PopupButton>
		};

	type ScanQrPopupParams =
		{ readonly text?: string
		};

	interface WebApp {
		readonly initData: string;
		readonly initDataUnsafe: WebAppInitData;
		readonly version: string;
		readonly platform: string;
		readonly colorScheme: WebAppColorScheme;
		readonly themeParams: WebAppThemeParams;
		readonly isExpanded: boolean;
		readonly viewportHeight: number;
		readonly viewportStableHeight: number;
		readonly headerColor: string;
		readonly backgroundColor: string;
		readonly isClosingConfirmationEnabled: boolean;
		readonly BackButton: BackButton;
		readonly MainButton: MainButton;
		readonly HapticFeedback: HapticFeedback;
		isVersionAtLeast(version: string): boolean;
		setHeaderColor(color: WebAppColorKeywords): void;
		setBackgroundColor(color: WebAppColorKeywords | string);
		enableClosingConfirmation(): void;
		disableClosingConfirmation(): void;
		onEvent(eventType: WebAppEventType, eventHandler: Function): void;
		onEvent(eventType: 'themeChanged', eventHandler: () => void): void;
		onEvent(eventType: 'viewportChanged', eventHandler: (event: EventViewportChangedData) => void): void;
		onEvent(eventType: 'mainButtonClicked', eventHandler: () => void): void;
		onEvent(eventType: 'backButtonClicked', eventHandler: () => void): void;
		onEvent(eventType: 'settingsButtonClicked', eventHandler: () => void): void;
		onEvent(eventType: 'invoiceClosed', eventHandler: (event: EventInvoiceClosedData) => void): void;
		onEvent(eventType: 'popupClosed', eventHandler: (event: EventPopupClosedData) => void): void;
		onEvent(eventType: 'qrTextReceived', eventHandler: (event: EventQrTextReceivedData) => void): void;
		onEvent(eventType: 'clipboardTextReceived', eventHandler: (event: EventClipboardTextReceivedData) => void): void;
		offEvent(eventType: WebAppEventType): void;
		sendData?(data: string): void;
		switchInlineQuery(query: string, choose_chat_types?: InlineQueryChatType | Array<InlineQueryChatType>): void;
		openLink(url: string, options?: { try_instant_view: true }): void;
		openTelegramLink(url: string): void;
		openInvoice(url: string, callback?: (event: Pick<EventInvoiceClosedData, 'status'>) => void): void;
		showPopup(params: PopupParams, callback?: (event: Pick<EventPopupClosedData, 'button_id'>) => void): void;
		showAlert(message: string, callback?: () => void): void;
		showConfirm(message: string, callback?: (isOk: boolean) => void): void;
		showScanQrPopup(params: ScanQrPopupParams, callback?: (event: Pick<EventQrTextReceivedData, 'data'>) => boolean): void;
		closeScanQrPopup(): void;
		readTextFromClipboard?(callback?: (event: Pick<EventClipboardTextReceivedData, 'data'>) => void): void;
		ready(): void;
		expand(): void;
		close(): void;
	}

	const WebApp: WebApp;
}
