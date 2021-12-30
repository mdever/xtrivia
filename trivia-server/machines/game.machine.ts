import { createMachine, assign, EventObject } from 'xstate';
import { Observable } from 'rxjs';
import WebSocket from 'ws';

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

const wsConnections: { [key: string]: WebSocket } = {};

export function registerConnection(id: string, socket: WebSocket): void {
    wsConnections[id] = socket;
}

export interface GameState {
    name: string;
    clients: {
        wsId: string,
        username: string,
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
    score: { [username: string]: number },
    tiebreaker?: {
        text: string,
        hint?: string
    },
    tiebreakerResponses?: { 
        username: string;
        answer: string;
        correct: boolean | null;
    }[]
}

export interface ClientEvent {
    username: string;
}

export interface PlayerAddedEvent extends EventObject {
    wsId: string;
    username: string;
    machine: any;
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

export interface TiebreakerResponseEvent extends EventObject, ClientEvent {
    answer: string
}

export interface EvaluateTiebreakerResponseEvent extends EventObject, ClientEvent {
    correct: boolean
}

export type GameEvent = PlayerAddedEvent
                      | SendQuestionEvent
                      | AnswerReceivedEvent
                      | RevealAnswerEvent
                      | TiebreakerResponseEvent
                      | EvaluateTiebreakerResponseEvent;

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
                        const socket = wsConnections[event.wsId];
                        const username = event.username;
                        socket.on('message', (msg) => {
                            debugger;
                            const message = JSON.parse(msg.toString());
                            const nextEvent = { username, ...message };
                            console.log('WS client got event');
                            console.log(JSON.stringify(nextEvent, null, 2));
                            event.machine.send(nextEvent);

                        });
                        return {
                            ...context,
                            clients: [...context.clients, { wsId: event.wsId, username: event.username }],
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
                        const questionId = context.round;
                        const correctAnswer = context.answers.filter(a => a.questionId === questionId).find(a => a.correct);
                        const correct = event.answerId === correctAnswer.id;

                        console.log('Inside machine action and received answer from user ' + event.username);
                        if (correct) {
                            console.log('Answer is correct');
                        } else {
                            console.log('Answer is not correct');
                        }
                        
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
                            (context, event: RevealAnswerEvent) => {
                                const question = context.questions.find(q => q.id === context.round - 1);
                                const correctAnswer = context.answers.filter(a => a.questionId === question.id).find(a => a.correct);
                                context.clients.forEach(c => {
                                    const ws = wsConnections[c.wsId];
                                    ws.send(JSON.stringify({
                                        type: 'REVEAL_ANSWER',
                                        questionId: question.id,
                                        answerId: correctAnswer.id
                                    }));
                                })
                            },
                            assign((context, event: RevealAnswerEvent) => {
                              return {
                                  ...context,
                                  round: context.round+1
                              }
                            })
                        ],
                        target: 'tie-or-game-done'
                    },
                    {
                        actions: [
                            (context, event: RevealAnswerEvent) => {
                                const question = context.questions.find(q => q.id === context.round);
                                const correctAnswer = context.answers.filter(a => a.questionId === question.id).find(a => a.correct);
                                context.clients.forEach(c => {
                                    const ws = wsConnections[c.wsId];
                                    ws.send(JSON.stringify({
                                        type: 'REVEAL_ANSWER',
                                        questionId: question.id,
                                        answerId: correctAnswer.id
                                    }))
                                })
                            },
                            assign((context, event: RevealAnswerEvent) => {
                              return {
                                  ...context,
                                  round: context.round+1
                              }
                            })
                        ],
                        target: 'awaiting-question'
                    }
                ],
            }
        },
        'tie-or-game-done': {
            always: [
                {
                    cond: (context, event) => {
                        const maxScorePlayer = Object.keys(context.score).reduce((highest, next) => {
                            if (highest === null) {
                                return next
                            }

                            if (context.score[next] > context.score[highest]) {
                                return next;
                            } else {
                                return highest;
                            }
                        }, null);

                        const highestScore = context.score[maxScorePlayer];
                        const tiedPlayers = [];
                        Object.keys(context.score).forEach(playerName => {
                            if (context.score[playerName] === highestScore) {
                                tiedPlayers.push({ username: playerName, score: context.score[playerName]})
                            }
                        });

                        if (tiedPlayers.length > 1 && context.tiebreaker) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    target: 'tie'
                }, {
                    target: 'game-done'
                }
            ]
        },
        'tie': {
            on: {
                'SEND_TIEBREAKER': {
                    actions: (context, event) => {
                        context.clients.forEach(({ wsId }) => {
                            const socket = wsConnections[wsId];
                            socket.send(JSON.stringify({
                                type: 'TIEBREAKER',
                                text: context.tiebreaker.text,
                                hint: context.tiebreaker.hint
                            }));
                        })
                    },
                    target: 'awaiting-tiebreaker-response'
                }
            }
        },
        'awaiting-tiebreaker-response': {
            on: {
                'TIEBREAKER_RESPONSE': {
                    actions: assign((context, event: TiebreakerResponseEvent) => {
                        return {
                            ...context,
                            tiebreakerResponses: [
                                ...context.tiebreakerResponses,
                                { 
                                    username: event.username,
                                    answer: event.answer,
                                    correct: null
                                }
                            ]
                        }
                    }),
                    target: 'awaiting-tiebreaker-response'
                },
                'EVALUATE_TIEBREAKER_RESPONSE': {
                    actions: assign((context, event: EvaluateTiebreakerResponseEvent) => {
                        const response = context.tiebreakerResponses.find(r => r.username === event.username);
                        const responseIdx = context.tiebreakerResponses.indexOf(response);
                        const evaluatedResponse = {
                            ...response,
                            correct: event.correct
                        };
                        return {
                            ...context,
                            tiebreakerResponses: [
                                ...context.tiebreakerResponses.slice(0, responseIdx), evaluatedResponse, ...context.tiebreakerResponses.slice(responseIdx+1)
                            ]
                        }
                    }),
                    target: 'awaiting-tiebreaker-response'
                },
                'DONE_EVALUATING': {
                    target: 'game-done',
                    actions: assign((context, event) => {
                        const newScores = { ...context.score };
                        for (const response of context.tiebreakerResponses) {
                            if (response.correct) {
                                newScores[response.username] += 1;
                            }
                        }

                        return {
                            ...context,
                            score: {
                                ...newScores
                            }
                        }
                    })
                }
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