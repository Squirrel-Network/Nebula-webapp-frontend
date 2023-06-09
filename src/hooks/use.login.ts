import { useEffect, useState } from 'react';
import { tap } from 'rxjs';
import loginService$ from '../services/login.service';

function useLogin() {
	const [logged, setLogged] = useState(() => false);

	useEffect(
		() => {
			const $ = loginService$
				.pipe(tap(res => console.log(res)))
				.subscribe();

			return () => $.unsubscribe();
		},
		[logged, setLogged]
	);

	return logged;
}

export default useLogin;
