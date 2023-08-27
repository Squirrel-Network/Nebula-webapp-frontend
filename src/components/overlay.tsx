import React, { useEffect, useReducer } from 'react';
import OverlayService from '../services/overlay.service';

export default function Overlay(
	{ children
	}
) {
	const [ isActive, updateIsActive ] = useReducer(
		() => OverlayService.isActive(),
		false
	);

	useEffect(function setOverlayListener() {
		OverlayService.addListener(updateIsActive);

		return () => OverlayService.removeListener(updateIsActive);
	}, [ updateIsActive ]);

	if(!isActive) {
		return <></>;
	}

	return <>
		<div className={ 'position-fixed bg-black bg-opacity-50 w-100 h-100 z-3' }>
			<div className={ 'd-flex w-100 h-100 align-items-center justify-content-center flex-wrap' }>
				{ children }
			</div>
		</div>
	</>;
}
