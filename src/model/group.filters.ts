import GetGroupFilters from './get.group.filters';

export default class GroupFilters {
	private filters: Map<string, boolean> = new Map();

	constructor(filters: GetGroupFilters = {}) {
		for(const k in filters) {
			this.filters.set(k, filters[k]);
		}
	}

	static fromForm(form: HTMLFormElement) {
		const newFilters = new GroupFilters({});

		Array.from(form.elements)
			.filter(e => e instanceof HTMLInputElement)
			.forEach((e: HTMLInputElement) =>
				newFilters.setFilter(e.name, Boolean(e.checked))
			);

		return newFilters;
	}

	static fromObject(filters: GetGroupFilters) {
		return new GroupFilters(filters);
	}

	getMap() {
		return this.filters;
	}

	setFilter(filter: string, value: boolean) {
		this.filters.set(filter, value);
	}

	toJSON(): object {
		const filters = {};

		for(const [k, v] of this.filters) {
			filters[k] = v;
		}

		return filters as GetGroupFilters;
	}
};
