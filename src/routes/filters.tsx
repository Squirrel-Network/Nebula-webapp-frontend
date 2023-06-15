import React from 'react';
import { Button, Container, Form, Table } from 'react-bootstrap';
import API from '../env/api';
import useFilters from '../hooks/use.filters';
import TelegramService from '../services/telegram.service';

type Filters = Map<string, boolean>;

const FiltersFormLegend = () =>
	<legend className="h1">Filters</legend>;

const FiltersFormTableHeader = () =>
	<thead>
		<tr>
			<td colSpan={ 2 }>
				<Form.Text muted>
					Filters settings for the group.
				</Form.Text>
			</td>
		</tr>
	</thead>;

const FiltersFormTableBody = ({ filters }: { filters: Filters }) =>
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
	</tbody>;

const FiltersFormTableFooter = () =>
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
	</tfoot>;

const FiltersFormTable = ({ filters }: { filters: Filters }) =>
	<Table striped bordered hover>
		<FiltersFormTableHeader />
		<FiltersFormTableBody filters={ filters } />
		<FiltersFormTableFooter />
	</Table>;

function FiltersForm({ filters }: { filters: Filters }) {
	const action = API.FILTERS(TelegramService.chatId);

	return <>
		<Form
			action={ action.toString() }
			method="POST"
		>
			<fieldset>
				<FiltersFormLegend />
				<FiltersFormTable filters={ filters } />
			</fieldset>
		</Form>
	</>;
}

export default function RouteFilters() {
	const filters = useFilters([]);

	return <>
		<Container fluid>
			<FiltersForm filters={ filters } />
		</Container>
	</>;
}
