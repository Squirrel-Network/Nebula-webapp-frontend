import { Axios } from 'axios-observable';
import API from '../env/api';
import FiltersResponse from '../model/filters.response';
import TelegramService from './telegram.service';

const endpoint = API.FILTERS(TelegramService.chatId);

const HEADER_INIT_DATA = 'X-Init-Data';
const HEADER_AUTHORIZATION = 'Authorization';

const filtersServiceGet$ = Axios.get<FiltersResponse>(
	endpoint.toString(),
	{ responseType: 'json'
	, headers:
		{ [HEADER_INIT_DATA]: TelegramService.initData
		, [HEADER_AUTHORIZATION]: 'Bearer ' + TelegramService.jwt
		}
	}
);

const filtersServicePost$ = (fd: FiltersResponse) => Axios.post(
	endpoint.toString(),
	fd,
	{ responseType: 'json'
	, headers:
		{ [HEADER_INIT_DATA]: TelegramService.initData
		, [HEADER_AUTHORIZATION]: 'Bearer ' + TelegramService.jwt
		}
	}
);

export default (
	{ get: filtersServiceGet$
	, post: filtersServicePost$
	}
);
