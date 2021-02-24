
import { io, Socket } from "socket.io-client";

type ResolverFn = (value: null) => any;

class SubscriptionHandler {
	constructor(private resolver: ResolverFn, private predicate: () => boolean) {}

	public test(): boolean {
		return this.predicate();
	}

	public resolve() {
		this.resolver(null)
	}
}


class SocketSubscription<T> {
	private responses: T[] = [];
	private handlers: SubscriptionHandler[] = [];

	constructor(socket: Socket, name: string,) {
		socket.on(name, (data: any) => {
			this.onResponse(data)
		})
	}

	private onResponse(data: T) {
		this.responses.push(data)
		this.handlers = this.handlers.filter(h => {
			if (h.test()) {
				h.resolve();
				return false;
			}
			return true;
		})
	}

	private waitFor(predicate: () => boolean): Promise<null> {
		return new Promise((resolve, reject) => {
			this.handlers.push(new SubscriptionHandler(resolve, predicate))
		})
	}

	public waitUntil(predicate: (value: T) => boolean) {
		return this.waitFor(() => {
			const last = this.responses[this.responses.length - 1]
			return last != null && predicate(last)
		})
	}

	public waitForAny() {
		return this.waitForEvents(1);
	}

	public waitForEvents(num: number) {
		return this.waitFor(() => this.responses.length >= num)
	}

	public get(index: number) {
		return this.responses[index];
	}
}

class SocketTester {
	constructor(private socket: Socket) {}

	public on<T>(name: string) {
		return new SocketSubscription<T>(this.socket, name);
	}
}

export { SocketTester }