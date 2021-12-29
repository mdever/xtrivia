import { createMachine, assign, EventObject } from 'xstate';
import { Observable } from 'rxjs';
import { raise } from 'xstate/lib/actions';
import { eventNames } from 'process';

export function makeid(length: number): string {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

export const wsConnections: { [key: string]: WebSocket } = {};

export interface GameState {
    name: string;
    clients: {
        wsId: string,
        username: string,
        events$: Observable<string>
    }[];
    questions: {
        id: number,
        text: string,
        hint?: string,
    }[];
    answers: {
        id: number,
        text: string,
        correct: boolean,
        questionId: number;
    }[],
    round: number;
    score: { [username: string]: number }
}

export interface ClientEvent {
    username: string;
}

export interface PlayerAddedEvent extends EventObject {
    ws: WebSocket;
    username: string
}

export interface SendQuestionEvent extends EventObject {
    type: 'SEND_QUESTION'
}

export interface AnswerReceivedEvent extends EventObject, ClientEvent {
    questionId: number;
    answerId: number;
}

export interface RevealAnswerEvent extends EventObject {
    questionId: number;
    answerId: number;
}

export type GameEvent = PlayerAddedEvent
                      | SendQuestionEvent
                      | AnswerReceivedEvent
                      | RevealAnswerEvent;

export const GameMachine = createMachine<GameState, GameEvent>({
    id: 'game-machine',
    initial: 'awaiting-players',
    context: {
        name: 'default',
        clients: [],
        questions: [],
        answers: [],
        round: 0,
        score: {}
    },
    states: {
        'awaiting-players': {
            on: {
                'PLAYER_ADDED': {
                    target: 'awaiting-players',
                    actions: assign((context, event: PlayerAddedEvent) => {
                        const id = makeid(10);
                        wsConnections[id] = event.ws;
                        const clientEvents$ = new Observable<string>(subscriber => {
                            const username = event.username;
                            wsConnections[id].onmessage = function(msg: MessageEvent<string>) {
                                const message = JSON.parse(msg.data);
                                const nextEvent = { username, ...message };
                                console.log('WS client got event');
                                console.log(JSON.stringify(nextEvent, null, 2));
                                subscriber.next(nextEvent);

                                return function unsubscribe() {
                                    console.log(`Observable for ${event.username} has been unsubscribed`)
                                }
                            };
                        })
                        return {
                            ...context,
                            clients: [...context.clients, { wsId: id, username: event.username, events$: clientEvents$ }],
                            score: { ...context.score, [event.username]: 0 }
                        }
                    })
                },
                'START_GAME': 'awaiting-question'
            }
        },
        'awaiting-question': {
            on: {
                'SEND_QUESTION': {
                    target: 'awaiting-answers',
                    actions: (context, event: SendQuestionEvent) => {
                        const question = context.questions[context.round] as any;
                        const answers = context.answers.filter(a => a.questionId === question.id).map(a => {
                            const { correct, ...rest } = a;
                            return rest;
                        });
                        question['answers'] = answers;
                        context.clients.forEach(({ wsId }) => {
                            const ws = wsConnections[wsId];
                            setTimeout(() => {
                                ws.send(JSON.stringify({
                                    type: 'NEXT_QUESTION',
                                    ...question
                                }));
                            }, 1000);
                        })
                    }
                }
            }
        },
        'awaiting-answers': {
            on: {
                'ANSWER_RECEIVED': {
                    target: 'awaiting-answers',
                    actions: assign((context, event: AnswerReceivedEvent) => {
                        const correctAnswer = context.answers.filter(a => a.questionId === event.questionId).find(a => a.correct);
                        const correct = event.answerId === correctAnswer.id;

                        if (correct) {
                            return {
                                ...context,
                                score: {
                                    ...context.score,
                                    [event.username]: context.score[event.username] + 1
                                }
                            }
                        } else {
                            return {
                                ...context
                            }
                        }
                    })
                },
                'REVEAL_ANSWER': [
                    {
                        cond: (context, event) => {
                            return context.round === context.questions.length - 1;
                        },
                        actions: [
                            assign((context, event: RevealAnswerEvent) => {
                              return {
                                  ...context,
                                  round: context.round+1
                              }
                            }),
                            (context, event: RevealAnswerEvent) => {
                                context.clients.forEach(c => {
                                    const ws = wsConnections[c.wsId];
                                    ws.send(JSON.stringify({
                                        type: 'REVEAL_ANSWER',
                                        questionId: event.questionId,
                                        answerId: event.answerId
                                    }))
                                })
                            }
                        ],
                        target: 'game-done'
                    },
                    {
                        actions: [
                            assign((context, event: RevealAnswerEvent) => {
                              return {
                                  ...context,
                                  round: context.round+1
                              }
                            }),
                            (context, event: RevealAnswerEvent) => {
                                context.clients.forEach(c => {
                                    const ws = wsConnections[c.wsId];
                                    ws.send(JSON.stringify({
                                        type: 'REVEAL_ANSWER',
                                        questionId: event.questionId,
                                        answerId: event.answerId
                                    }))
                                })
                            }
                        ],
                        target: 'awaiting-question'
                    }
                ],
            }
        },
        'game-done': {
            type: 'final',
            entry: (context, event) => {
                context.clients.forEach(c => {
                    const ws = wsConnections[c.wsId];
                    const winner = Object.keys(context.score).reduce((winner, next) => {
                        if (winner === null) {
                            return next;
                        }

                        if (context.score[next] > context.score[winner]) {
                            return next;
                        } else {
                            return winner;
                        }
                    }, null);
                    ws.send(JSON.stringify({
                        type: 'GAME_DONE',
                        scores: {
                            ...context.score
                        },
                        winner 
                    }))
                })
            }
        }
    }
})