# socket.io-await-test

Testing a socket io server does need to be hard. Rather than registering handlers for messages, this library allows you to wait for the server to send you the response you expect using the await keyword in an async test function. 


## Example
See the test at test/client-test.js for a more complete example of how to use this in your socket.io server code.

```js
const tester = new SocketTester(client);
const pongs = tester.on('pong');

client.emit('ping', 1);
client.emit('ping', 2);
await pongs.waitForEvents(2)

assert.equal(pongs.get(0), 2)
assert.equal(pongs.get(1), 3)
```

## Install

```sh
npm install --save-dev socket.io-await-test
```

Import in your test
```js
const { SocketTester } = require('socket.io-await-test')
```

## Documentation

### SocketTester
Wrap a socket io socket instance to be able to register event handlers in a way to simplifies testing without having to pass in callback functions.

```
const tester = new SocketTester(client);
```

#### on<T>(name: string)
Get an instance of a SocketSubscription which collects all messages received for the given event name.

```
const pongs = tester.on<number>('pong');
```

### SocketSubscription
Collects messages for a given event name and provides method to suspend the test while waiting for messages to be received from the server. 

#### waitForEvents(num: number): Promise<null>
Returns a promise that will be resolved when a the specified number of events have been triggerd on the socket subscription.

#### waitUntil(predicate: (value: T) => boolean): Promise<null>
Returns a promise that will be resolved when the given predicate returns true for a received message. 

#### waitForAny(): Promise<null>
Returns a promise that will be resolved whenever a message is received. 
