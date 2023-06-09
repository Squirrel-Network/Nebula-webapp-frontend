import { Axios } from 'axios-observable';
import API from '../env/api';
import PayloadLogin from '../model/payload.login';

const endpoint = API.LOGIN;

const loginService$ =
	Axios.post(endpoint, new PayloadLogin(Telegram.WebApp.initData));

export default loginService$;
