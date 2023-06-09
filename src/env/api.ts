declare var process;

const API =
	{ SERVER_BASE: new URL(process.env.SERVER_BASE as string)
	, get LOGIN() {
		return new URL('/login', this.SERVER_BASE)
	}
	};

export default API;
