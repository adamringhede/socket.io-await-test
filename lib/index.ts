
import { io, Socket } from "socket.io-client";

type ResolverFn = (value: unknown) => any;

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

	private waitFor(predicate: () => any) {
		return new Promise((resolve, reject) => {
			this.handlers.push(new SubscriptionHandler(resolve, predicate))
		})
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

	public on(name: string) {
		return new SocketSubscription(this.socket, name);
	}
}

export { SocketTester }