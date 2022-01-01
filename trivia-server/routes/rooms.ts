import express from 'express';
import { requiresFields } from '../middleware/validation';
import { authenticate, authorizeUserOwnsGame } from '../middleware/auth';
import { applicationJson } from '../middleware';
import { getConnection, User, Room, Game, Ticket } from '../entity';
import { createTicket } from './tickets';

const debug = require('debug')('trivia-server:routes:rooms');

const router = express.Router();

router.post('/games/:gameId/rooms', authenticate, authorizeUserOwnsGame('gameId'), requiresFields(['name']), async (req: express.Request, res: express.Response) => {
    const { gameId } = req.params;
    const { username, userid } = res.locals;
    const { name } = req.body;
    
    const userRepo = getConnection().getRepository(User);
    const roomRepo = getConnection().getRepository(Room);
    const gameRepo = getConnection().getRepository(Game);

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
    const ticket = new Ticket();
    ticket.ticket = createTicket();
    ticket.owner = true;
    ticket.user = user;
    ticket.room = room;
    room.tickets = [ticket];

    room = await roomRepo.save(room);

    res.status(201);
    res.send({
        ...room
    });
    res.end();
    return;
    
}, applicationJson)

export default router;