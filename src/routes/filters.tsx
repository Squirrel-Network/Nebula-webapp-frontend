import { AxiosError, AxiosResponse } from 'axios';
import React, {
	Context,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useReducer,
	useState
} from 'react';

import { Button, Container, Form, Spinner, Table } from 'react-bootstrap';
import { map, tap, Subject } from 'rxjs';

import GroupInfo from '../components/group-info';
import Overlay from '../components/overlay';
import API from '../env/api';
import useFilters from '../hooks/use.filters';
import GroupFilters from '../model/group.filters';
import OverlayService from '../services/overlay.service';
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
				<Form.Text>
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
							id={ f }
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
				<Form.Text>
					The filters will allow Nebula to prevent such kind of files
					to be posted in the chat.
				</Form.Text>
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
	{ onChange }: { onChange: OnFiltersChangeHandler }
) {
	return <>
		<Form
			name='save-filters'
			method="dialog"
			onSubmitCapture={ e => e.preventDefault() }
		>
			<GroupInfo id={ TelegramService.chatId } />

			<fieldset>
				<FiltersFormLegend />
				<FiltersFormTable onFiltersChange={ onChange } />
			</fieldset>
		</Form>
	</>;
}

export default function RouteFilters() {
	const onError = useCallback(function onError(err: AxiosError) {
		const isOff = !navigator.onLine;

		let msg: string;

		if(isOff) {
			msg = 'Your device appears to be offline.';
		}
		else if(err?.isAxiosError) {
			msg = err.message;
		}
		else {
			msg = 'Unknown error: ' + err.message;
		}

		Telegram.WebApp.showAlert(msg);

		OverlayService.pop();
	}, []);
	const onComplete = useCallback(function onComplete(r: AxiosResponse) {
		let msg: string;

		if(r.status != 200) {
			const data = r.data ?? '(empty response)';

			msg = 'Unexpected ' + r.statusText + ': ' + data;
		}
		else {
			msg = 'Filters saved successfully.';
		}

		Telegram.WebApp.showAlert(msg);

		OverlayService.pop();

		if(r.status == 200) {
			Telegram.WebApp.close();
		}
	}, []);
	const onStart = useCallback(function onStart() {
		OverlayService.push();
	}, []);

	const onSubmit = useCallback(function onSubmit() {
		const form = document.forms.namedItem('save-filters');

		actionSubmitFilters$.next(form);
	}, []);

	const onOverlayStatusChange = useCallback(
		function onOverlayStatusChange() {
			if(OverlayService.isActive()) {
				Telegram.WebApp.MainButton.color =
					getComputedStyle(document.documentElement)
						.getPropertyValue('--tg-theme-bg-color');
				Telegram.WebApp.MainButton.showProgress(true);
				Telegram.WebApp.MainButton.disable();
			}
			else {
				Telegram.WebApp.MainButton.color =
					getComputedStyle(document.documentElement)
						.getPropertyValue('--tg-theme-button-color');
				Telegram.WebApp.MainButton.hideProgress();
				Telegram.WebApp.MainButton.enable();
			}
		},
		[]
	);

	const [ filters, updateFilters ] =
		useFilters({ onStart, onComplete, onError }, []);
	const [ actionSubmitFilters$ ] = useState(new Subject<HTMLFormElement>());

	useEffect(function() {
		Telegram.WebApp.MainButton.setText('Save filters');
		Telegram.WebApp.MainButton.show();
		Telegram.WebApp.MainButton.onClick(onSubmit);

		OverlayService.addListener(onOverlayStatusChange);

		const $ = actionSubmitFilters$
			.pipe(map(GroupFilters.fromForm))
			.pipe(tap(updateFilters))
			.subscribe();

		return () => (
			$.unsubscribe(),
			OverlayService.removeListener(onOverlayStatusChange),
			Telegram.WebApp.MainButton.offClick(onSubmit),
			Telegram.WebApp.MainButton.hide()
		);
	}, [ actionSubmitFilters$ ]);

	return <>
		<Overlay>
			<Spinner animation="border" />
		</Overlay>
		<Container fluid>
			<FiltersContext.Provider value={ filters }>
				<FiltersForm
					onChange={ (k, v) => filters.set(k, v) }
				/>
			</FiltersContext.Provider>
		</Container>
	</>;
}
