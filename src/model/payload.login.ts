export default class PayloadLogin {
	constructor(
		public readonly initData
	) {
	}

	valueOf() {
		return (
			{ initData: this.initData
			}
		);
	}
}
