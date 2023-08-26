import { Axios } from 'axios-observable';

import API from '../env/api';
import GetGroupFilters from '../model/get.group.filters';
import TelegramService from './telegram.service';

const endpoint = API.FILTERS(TelegramService.chatId);

const HEADER_INIT_DATA = 'X-Init-Data';
const HEADER_AUTHORIZATION = 'Authorization';

const filtersServiceGet$ = Axios.get<GetGroupFilters>(
	endpoint.toString(),
	{ responseType: 'json'
	, headers:
		{ [ HEADER_INIT_DATA ]: TelegramService.initData
		, [ HEADER_AUTHORIZATION ]: 'Bearer ' + TelegramService.jwt
		}
	}
);

const filtersServicePost$ = (fd: GetGroupFilters) => Axios.post(
	endpoint.toString(),
	fd,
	{ responseType: 'json'
	, timeout: 10000
	, timeoutErrorMessage: 'Your request has timed out. Try again.'
	, headers:
		{ [ HEADER_INIT_DATA ]: TelegramService.initData
		, [ HEADER_AUTHORIZATION ]: 'Bearer ' + TelegramService.jwt
		}
	}
);

export default (
	{ get$: filtersServiceGet$
	, post$: filtersServicePost$
	}
);
