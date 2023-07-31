import React, { Context, createContext, FormEventHandler, useContext, useEffect, useReducer, useState } from 'react';
import { Button, Container, Form, Table } from 'react-bootstrap';
import { map, mergeMap, Subject, tap } from 'rxjs';
import API from '../env/api';
import useFilters from '../hooks/use.filters';
import FiltersResponse from '../model/filters.response';
import filtersService$ from '../services/filters.service';
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

function FiltersFormTableBody(
	{ onFiltersChange }: { onFiltersChange: (k: string, v: boolean) => void }
) {
	const filters = useContext(FiltersContext);
	const [filtersHash, dispatchHash] = useReducer(
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
	{ onFiltersChange }: { onFiltersChange: (k: string, v: boolean) => void }
) =>
	<Table striped bordered hover>
		<FiltersFormTableHeader />
		<FiltersFormTableBody onFiltersChange={ onFiltersChange } />
		<FiltersFormTableFooter />
	</Table>;

function mapHashReducer(_: string, m: Map<string, boolean>) {
	return Array.from(m.entries())
		.map(([k, v]) => k.toString() + ':'  + String(v))
		.reduce((acc, next) => acc + next + ';');
}

function FiltersForm(
	{ onChange
	, onSubmit
	}: { onChange: (k: string, v: boolean) => void
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
	const filters = useFilters([]);
	const [ submitFilters$ ] = useState(new Subject<HTMLFormElement>());

	useEffect(function() {
		const $ = submitFilters$
			.pipe(map(f => {
				const fd = {} as FiltersResponse;

				Array.from(f.elements)
					.filter(e => e instanceof HTMLInputElement)
					.forEach((e: HTMLInputElement) =>
						fd[e.name] = Boolean(e.checked)
					);

				return fd;
			}))
			.pipe(mergeMap(fd => filtersService$.post(fd)))
			.subscribe();

		return () => $.unsubscribe();
	}, [ submitFilters$ ]);

	return <>
		<Container fluid>
			<FiltersContext.Provider value={ filters }>
				<FiltersForm
					onChange={ (k, v) => filters.set(k, v) }
					onSubmit={ e => {
						e.preventDefault();

						submitFilters$.next(e.currentTarget);
					} }
				/>
			</FiltersContext.Provider>
		</Container>
	</>;
}
