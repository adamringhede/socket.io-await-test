const { SocketTester } = require("../dist/index");
const ioClient = require('socket.io-client');
const assert = require('chai').assert;
const server = require('http').createServer();
const io = require('socket.io')(server);


function setupServer() {
    io.on('connection', client => {
        client.on('ping', number => { 
            client.emit('pong', number + 1)
        });
    });
    server.listen(3000);
    return server;
}

const socketUrl = 'http://127.0.0.1:3000';
const options = {
    'force new connection': true,
};

describe("SocketTester", () => {
    let server; 
    let client; 

    before(() => {
        server = setupServer();
    })
    after(() => {
        server.close();
    })

    beforeEach(() => {
        client = ioClient.connect(socketUrl, options);
    })

    afterEach(() => {
        client.close();
    });

    describe("wait for tests", () => {
        it("resolves when a number of events are received", async () => {
            const tester = new SocketTester(client);
            const pongs = tester.on('pong');
            
            client.emit('ping', 1);
            client.emit('ping', 2);
            await pongs.waitForEvents(2)
    
            assert.equal(pongs.get(0), 2)
            assert.equal(pongs.get(1), 3)
        })
    })

    describe("wait until", () => {
        it("resolves when a predicate is true", async () => {
            const tester = new SocketTester(client);
            const pongs = tester.on('pong');
            
            client.emit('ping', 1);
            client.emit('ping', 2);
            await pongs.waitUntil(value => value === 3)
            assert.equal(pongs.get(1), 3)
        })
    })


});