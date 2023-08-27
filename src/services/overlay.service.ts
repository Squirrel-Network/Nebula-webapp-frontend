const listenersSymbol = Symbol('nebula/overlay/listeners');

let counter = 0;

const OverlayService =
	{ [listenersSymbol]: [] as Array<(action: '+' | '-') => void>
	, addListener(l: (action: '+' | '-') => void) {
		OverlayService[listenersSymbol].push(l);
	}
	, removeListener(l: (action: '+' | '-') => void) {
		OverlayService[listenersSymbol].splice(
			OverlayService[listenersSymbol].indexOf(l),
			1
		);
	}
	, push() {
		counter++;

		for(const l of OverlayService[listenersSymbol]) {
			l('+');
		}
	}
	, pop() {
		counter--;

		for(const l of OverlayService[listenersSymbol]) {
			l('-');
		}
	}
	, isActive() {
		return counter > 0;
	}
	};

export default OverlayService;
