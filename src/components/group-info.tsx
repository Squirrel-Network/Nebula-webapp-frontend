import React, { useCallback, useEffect, useReducer, useState } from 'react';

import useGroup from '../hooks/use.group';

function CopyDetail(
	{ clipboardText }: { clipboardText: string }
) {
	const [ buttonStatus, updateButtonStatus ] = useState('initial');

	const copyDetailsCallback = useCallback(function copyDetails() {
		navigator.clipboard.writeText(clipboardText)
			.then(() => updateButtonStatus('copied'));
	}, [ clipboardText ]);

	useEffect(function changeButtonText() {
		if(buttonStatus == 'copied') {
			setTimeout(() => updateButtonStatus('initial'), 700);
		}
	}, [ buttonStatus ]);

	return <>
		<button
			className={ 'btn btn-outline-primary btn-copy btn-copy-' + buttonStatus }
			type="button"
			onClickCapture={ copyDetailsCallback }
		>
			{ buttonStatus == 'initial'
				? null
				: <>Copied!&nbsp;</>
			}
			<i className="bi bi-clipboard"></i>
		</button>
	</>;
}

export default function GroupInfo({ id }: { id: string }) {
	const group = useGroup(id, [ id ]);
	const [ altText, updateAltText ] = useReducer(
		(_: string, name: string) => 'Picture of the group: ' + name,
		group.name
	);

	useEffect(() => updateAltText(group.name), [ group ]);

	return <>
		<details className="group-info">
			<summary className="mb-1">Information of the group</summary>

			<figure className="card">
				<img
					className="card-img-top"
					src={ group.photo }
					alt={ altText }
					width="50%"
				/>

				<figcaption className="card-body">
					<span className="h2 card-text">
						{ group.name }
					</span>

					<hr />

					<dl className="card-text">
						<dt>Chat Id</dt>
						<dd>
							{ group.chatId }
							<CopyDetail
								clipboardText={ group.chatId?.toString() }
							/>
						</dd>

						<dt>Language</dt>
						<dd>{ group.language }</dd>

						<dt>Total users</dt>
						<dd>{ group.totalUsers }</dd>

						<dt>Total messages</dt>
						<dd>{ group.totalMessages }</dd>

						<dt>Max Warn</dt>
						<dd>{ group.maxWarn }</dd>
					</dl>
				</figcaption>
			</figure>
		</details>
	</>;
};
