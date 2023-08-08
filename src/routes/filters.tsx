import React, { Context, createContext, FormEventHandler, useContext, useEffect, useReducer, useState } from 'react';

import { Button, Container, Form, Table } from 'react-bootstrap';
import { map, tap, Subject } from 'rxjs';

import GroupInfo from '../components/group-info';
import API from '../env/api';
import useFilters from '../hooks/use.filters';
import GroupFilters from '../model/group.filters';
import TelegramService from '../services/telegram.service';

type Filters = Map<string, boolean>;
type OnFiltersChangeHandler = (k: string, v: boolean) => void;

const FiltersContext = createContext(new Map()) as Context<Filters>;

function mapHashReducer(_: string, m: Filters) {
	return Array.from(m.entries())
		.map(([k, v]) => k.toString() + ':'  + String(v))
		.reduce((acc, next) => acc + next + ';');
}

const FiltersFormLegend = () =>
	<legend className="h1">Filters</legend>;

const FiltersFormTableHeader = () =>
	<thead>
		<tr>
			<td colSpan={ 2 }>
				<GroupInfo id={ TelegramService.chatId } />
			</td>
		</tr>
		<tr>
			<td colSpan={ 2 }>
				<Form.Text muted>
					Filters settings for the group.
				</Form.Text>
			</td>
		</tr>
	</thead>;

function FiltersFormTableBody(
	{ onFiltersChange }: { onFiltersChange: OnFiltersChangeHandler }
) {
	const filters = useContext(FiltersContext);
	const [ filtersHash, dispatchHash ] = useReducer(
		mapHashReducer,
		''
	);

	return <>
		<tbody data-hash={ filtersHash }>
			{ Array.from(filters.entries()).map(([ f, v ], i) =>
				<tr key={ i }>
					<th>
						<Form.Label htmlFor={ f }>
							{ f }
						</Form.Label>
					</th>
					<td>
						<Form.Check
							name={ f }
							type="switch"
							checked={ Boolean(v) }
							onChange={ e => {
								onFiltersChange(f, e.target.checked);
								dispatchHash(filters);
							} }
						/>
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
				>Submit</Button>
			</td>
		</tr>
	</tfoot>;

const FiltersFormTable = (
	{ onFiltersChange }: { onFiltersChange: OnFiltersChangeHandler }
) =>
	<Table striped bordered hover>
		<FiltersFormTableHeader />
		<FiltersFormTableBody onFiltersChange={ onFiltersChange } />
		<FiltersFormTableFooter />
	</Table>;

function FiltersForm(
	{ onChange
	, onSubmit
	}: { onChange: OnFiltersChangeHandler
		, onSubmit: FormEventHandler<HTMLFormElement>
		}
) {
	const action = API.FILTERS(TelegramService.chatId);

	return <>
		<Form
			action={ action.toString() }
			method="POST"
			onSubmitCapture={ onSubmit }
		>
			<fieldset>
				<FiltersFormLegend />
				<FiltersFormTable onFiltersChange={ onChange } />
			</fieldset>
		</Form>
	</>;
}

export default function RouteFilters() {
	const [ filters, updateFilters ] = useFilters([]);
	const [ actionSubmitFilters$ ] = useState(new Subject<HTMLFormElement>());

	useEffect(function() {
		const $ = actionSubmitFilters$
			.pipe(map(GroupFilters.fromForm))
			.pipe(tap(updateFilters))
			.subscribe();

		return () => $.unsubscribe();
	}, [ actionSubmitFilters$ ]);

	return <>
		<Container fluid>
			<FiltersContext.Provider value={ filters }>
				<FiltersForm
					onChange={ (k, v) => filters.set(k, v) }
					onSubmit={ e => {
						e.preventDefault();

						actionSubmitFilters$.next(e.currentTarget);
					} }
				/>
			</FiltersContext.Provider>
		</Container>
	</>;
}
