import React from 'react';
import useLogin from '../hooks/use.login';

export default function RouteFilter() {
	const isLogged = useLogin();

	return <>Filter</>;
}
