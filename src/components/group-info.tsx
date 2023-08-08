import React from 'react';
import useGroup from '../hooks/use.group';

export default function GroupInfo({ id }: { id: string }) {
	const group = useGroup(id);
	const altText = 'Picture of the group:' + group.name;

	return <>
		<figure>
			<img src={ group.photo } alt={ altText } width='50%' />

			<figcaption>
				<span className='h1'>
					{ group.name }
				</span>

				<hr />

				<dl className='chat-muted'>
					<dt>Chat Id</dt>
					<dd>{ group.chatId }</dd>

					<dt>Language</dt>
					<dd>{ group.language }</dd>

					<dt>Total users</dt>
					<dd>{ group.totalUsers }</dd>

					<dt>Total messages</dt>
					<dd>{ group.totalMessages }</dd>

					<dt>Max Warn</dt>
					<dl>{ group.maxWarn }</dl>
				</dl>
			</figcaption>
		</figure>
	</>;
};
