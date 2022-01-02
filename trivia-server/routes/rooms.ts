import express from 'express';
import { requiresFields } from '../middleware/validation';
import { authenticate, authorizeUserOwnsGame } from '../middleware/auth';
import { applicationJson } from '../middleware';
import { getConnection, User, Room, Game, Ticket, GameHistory } from '../entity';
import { createTicket } from './tickets';
import { createMachine, interpret, Interpreter, StateMachine } from 'xstate';
import { GameEvent, GameMachine, GameState, makeid } from '../machines/game.machine';

const debug = require('debug')('trivia-server:routes:rooms');

const router = express.Router();

const rooms: { [code: string]: Interpreter<GameState, any, GameEvent>} = { };

export function createRoom(code: string, context: Partial<GameState>) {
    const service = interpret(GameMachine.withContext({
        ...GameMachine.context,
        ...context
    }))

    rooms[code] = service;
    service.start();
}

export function getGame(code: string): null | Interpreter<GameState, any, GameEvent> {
    return rooms[code];
}

router.post('/games/:gameId/rooms', authenticate, authorizeUserOwnsGame('gameId'), requiresFields(['name']), async (req: express.Request, res: express.Response) => {
    const { gameId } = req.params;
    const { username, userid } = res.locals;
    const { name } = req.body;
    
    const userRepo = getConnection().getRepository(User);
    const roomRepo = getConnection().getRepository(Room);
    const gameRepo = getConnection().getRepository(Game);
    const gameHistoryRepo = getConnection().getRepository(GameHistory);

    const user = await userRepo.findOne(userid);
    const game = await gameRepo.findOne(gameId, {
        relations: ['questions', 'questions.answers']
    });

    if (!game) {
        res.status(404);
        res.send({
            error: {
                userMessage: 'Game not found',
                developerMessage: `No game with ID ${gameId} found`,
                code: 404
            }
        });
        res.end();
        return;
    }

    let room = new Room();
    room.name = name;
    room.game = game;
    room.code = makeid(5);
    const ticket = new Ticket();
    ticket.ticket = createTicket();
    ticket.owner = true;
    ticket.user = user;
    ticket.room = room;
    room.tickets = [ticket];
    let gameHistory = new GameHistory();
    gameHistory.game = game;
    gameHistory.name = name;
    gameHistory.playedDate = new Date();
    
    gameHistory = await gameHistoryRepo.save(gameHistory);
    room = await roomRepo.save(room);

    let answers = game.questions.reduce((answers, nextQ) => {
        answers.concat(nextQ.answers);
        return answers;
    }, []);

    let questions = game.questions.map(q => {
        const { answers, game, ...rest } = q;
        return rest;
    });

    let initialContext: Partial<GameState> = {
        name,
        answers,
        questions
    };

    createRoom(room.code, initialContext);

    res.status(201);
    res.send({
        ...room
    });
    res.end();
    return;
    
}, applicationJson)

export default router;