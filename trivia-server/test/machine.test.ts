import { interpret } from "xstate";
import { GameMachine, makeid, registerConnection } from "../machines/game.machine";
import WebSocket, { WebSocketServer } from 'ws';

let machine = interpret(GameMachine.withContext({
    ...GameMachine.context,
    name: 'Test Game',
    questions: [
        {
            id: 0,
            text: 'How old am I?',
            hint: "It's not that hard",
        }
    ],
    answers: [
        {
            questionId: 0,
            id: 0,
            text: '31',
            correct: false
        },
        {
            questionId: 0,
            id: 1,
            text: '32',
            correct: true
        }
    ]
}));

machine.start();
machine.onTransition((context, event) => {
    console.log('New transition occurred');
    if (event.type !== 'PLAYER_ADDED') {
        console.log('Event: ');
        console.log(JSON.stringify(event, null, 2));
    }
    console.log('Value: ');
    console.log(context.value);
    console.log('Score: ');
    console.log(JSON.stringify(context.context.score, null, 2));
})

const server = new WebSocketServer({
    port: 8888
});

server.on('connection', (socket: WebSocket) => {
    socket.on('message', (msg) => {
        const message = JSON.parse(msg.toString());
        if (message.type === 'PLAYER_ADDED') {
            socket.removeAllListeners();
            const id = makeid(10);
            registerConnection(id, socket);
            message['wsId'] = id;
            message['machine'] = machine;
            machine.send(message);
        }
    })
});

const ws1 = new WebSocket('ws://localhost:8888');
const ws2 = new WebSocket('ws://localhost:8888');
const ws3 = new WebSocket('ws://localhost:8888');
ws1.on('message', (msg) => {
    console.log('ws1 got message');
    console.log(msg.toString());
    const m = JSON.parse(msg.toString());
    if (m.type === 'NEXT_QUESTION') {
        ws1.send(JSON.stringify({
            type: 'ANSWER_RECEIVED',
            questionId: 0,
            answerId: 1
        }));
    }
});

ws1.on('open', () => {
    ws1.send(JSON.stringify({
        type: 'PLAYER_ADDED',
        username: 'CapnDuck'
    }))
});

ws2.on('message', (msg) => {
    console.log('ws2 got message');
    console.log(msg.toString());
    const m = JSON.parse(msg.toString());
    if (m.type === 'NEXT_QUESTION') {
        ws2.send(JSON.stringify({
            type: 'ANSWER_RECEIVED',
            questionId: 0,
            answerId: 0
        }));
    }
})
ws2.on('open', () => {
    ws2.send(JSON.stringify({
        type: 'PLAYER_ADDED',
        username: 'MrJauntson'
    }))
});

ws3.on('message', (msg) => {
    console.log('ws3 got message');
    console.log(msg.toString());
    const m = JSON.parse(msg.toString());
    if (m.type === 'NEXT_QUESTION') {
        ws3.send(JSON.stringify({
            type: 'ANSWER_RECEIVED',
            questionId: 0,
            answerId: 1
        }));
    }
});
ws3.on('open', () => {
    ws3.send(JSON.stringify({
        type: 'PLAYER_ADDED',
        username: 'ElGuapo'
    }))
});

setTimeout(() => {
    machine.send('START_GAME');

    setTimeout(() => {
        machine.send({
            type: 'SEND_QUESTION'
        });

        setTimeout(() => {
            ws1.close();
            ws2.close();
            ws3.close();
            server.close();
        }, 2000);
    }, 2000);
}, 2000)

