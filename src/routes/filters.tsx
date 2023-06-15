import React, { useState } from 'react';
import { Button, Container, Form, Table } from 'react-bootstrap';
import API from '../env/api';
import useFilters from '../hooks/use.filters';
import TelegramService from '../services/telegram.service';

export default function RouteFilters() {
	const filters = useFilters([]);
	const [ action ] = useState(() => API.FILTERS(TelegramService.chatId));

	return <>
		<Container fluid>
			<Form
				action={ action.toString() }
				method="POST"
			>
				<fieldset>
					<legend className="h1">Filters</legend>

					<Table striped bordered hover>
						<thead>
							<tr>
								<td colSpan={ 2 }>
									<Form.Text muted>
										Filters settings for the group.
									</Form.Text>
								</td>
							</tr>
						</thead>
						<tbody>
							{ Array.from(filters.entries()).map(([f, v], i) =>
								<tr key={ i }>
									<th>
										<Form.Label htmlFor={ f }>
											{ f }
										</Form.Label>
									</th>
									<td>
										<Form.Check id={ f } type="switch" />
									</td>
								</tr>
							)
							}
						</tbody>
						<tfoot>
							<tr>
								<td colSpan={ 2 }>
									<Button
										variant="primary"
										className="w-100"
										type="submit"
									>Primary</Button>
								</td>
							</tr>
						</tfoot>
					</Table>
				</fieldset>
			</Form>
		</Container>
	</>;
}
