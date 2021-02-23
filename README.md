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
