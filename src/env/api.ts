declare var process: { env: { [index: string]: any } };

const API =
	{ API_SERVER: new URL(process.env.API_SERVER as string)
	, get V1() {
		return new URL('/v1/', this.API_SERVER);
	}
	, GROUP(groupId: string) {
		return new URL(`group/${groupId}/`, this.V1);
	}
	, FILTERS(groupId: string) {
		return new URL('filters', this.GROUP(groupId));
	}
	};

export default API;
