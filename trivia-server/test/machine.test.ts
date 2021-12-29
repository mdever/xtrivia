import { interpret } from "xstate";
import { GameMachine } from "../machines/game.machine";
import ws from 'ws';

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
    console.log(JSON.stringify(context.context.score, null, 2));
})

const server = new ws.WebSocketServer({
    port: 8888
});

server.on('connection', (ws) => {
    ws.on('message', (msg) => {
        const message = JSON.parse(msg.toString());
        if (message.type === 'PLAYER_ADDED') {
            message['ws'] = ws;
        }
        machine.send(message);
    })
});

const ws1 = new ws.WebSocket('ws://localhost:8888');
const ws2 = new ws.WebSocket('ws://localhost:8888');
const ws3 = new ws.WebSocket('ws://localhost:8888');
ws1.onmessage = function(msg) {
    console.log('ws1 got message');
    console.log(msg.data);
    const m = JSON.parse(msg.data.toString());
    if (m.type === 'NEXT_QUESTION') {
        ws1.send(JSON.stringify({
            type: 'ANSWER_RECEIVED',
            questionId: 0,
            answerId: 1
        }));
    }
}
ws1.onopen = function() {
    ws1.send(JSON.stringify({
        type: 'PLAYER_ADDED',
        username: 'CapnDuck'
    }))
}

ws2.onmessage = function(msg) {
    console.log('ws2 got message');
    console.log(msg.data);
    const m = JSON.parse(msg.data.toString());
    if (m.type === 'NEXT_QUESTION') {
        ws2.send(JSON.stringify({
            type: 'ANSWER_RECEIVED',
            questionId: 0,
            answerId: 0
        }));
    }
}
ws2.onopen = function() {
    ws2.send(JSON.stringify({
        type: 'PLAYER_ADDED',
        username: 'MrJauntson'
    }))
}

ws3.onmessage = function(msg) {
    console.log('ws3 got message');
    console.log(msg.data);
    const m = JSON.parse(msg.data.toString());
    if (m.type === 'NEXT_QUESTION') {
        ws3.send(JSON.stringify({
            type: 'ANSWER_RECEIVED',
            questionId: 0,
            answerId: 1
        }));
    }
}
ws3.onopen = function() {
    ws3.send(JSON.stringify({
        type: 'PLAYER_ADDED',
        username: 'ElGuapo'
    }))
}

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

