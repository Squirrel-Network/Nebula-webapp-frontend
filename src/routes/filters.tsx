import React, { Context, createContext, useContext } from 'react';
import { Button, Container, Form, Table } from 'react-bootstrap';
import API from '../env/api';
import useFilters from '../hooks/use.filters';
import TelegramService from '../services/telegram.service';

type Filters = Map<string, boolean>;

const FiltersContext = createContext(new Map()) as Context<Filters>;

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

function FiltersFormTableBody() {
	const filters = useContext(FiltersContext);

	return <>
		<tbody>
			{ Array.from(filters.entries()).map(([ f, v ], i) =>
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
	</>;
}

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

const FiltersFormTable = () =>
	<Table striped bordered hover>
		<FiltersFormTableHeader />
		<FiltersFormTableBody />
		<FiltersFormTableFooter />
	</Table>;

function FiltersForm() {
	const action = API.FILTERS(TelegramService.chatId);

	return <>
		<Form
			action={ action.toString() }
			method="POST"
		>
			<fieldset>
				<FiltersFormLegend />
				<FiltersFormTable />
			</fieldset>
		</Form>
	</>;
}

export default function RouteFilters() {
	const filters = useFilters([]);

	return <>
		<Container fluid>
			<FiltersContext.Provider value={ filters }>
				<FiltersForm />
			</FiltersContext.Provider>
		</Container>
	</>;
}
