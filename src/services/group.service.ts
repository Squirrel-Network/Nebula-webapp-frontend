import { Axios } from 'axios-observable';

import API from '../env/api';
import GetGroupInfo from '../model/get.group.info';
import TelegramService from './telegram.service';

const HEADER_INIT_DATA = 'X-Init-Data';
const HEADER_AUTHORIZATION = 'Authorization';

const getGroupInfo$ = (id: string) => Axios.get<GetGroupInfo>(
	API.GROUP(id).toString(),
	{ responseType: 'json'
	, headers:
		{ [ HEADER_INIT_DATA ]: TelegramService.initData
		, [ HEADER_AUTHORIZATION ]: 'Bearer ' + TelegramService.jwt
		}
	}
);

export default (
	{ get$: getGroupInfo$
	}
);
