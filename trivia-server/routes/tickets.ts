import { getConnection, User, Ticket, Room } from '../entity';
import express from 'express';
import { authenticate } from '../middleware/auth';
import { requiresFields } from '../middleware/validation';
import crypto from 'crypto';

const debug = require('debug')('trivia-server:routes:tickets');

const router = express.Router();

export function createTicket(): string {
    return crypto.randomBytes(64).toString('hex');
}

router.post('/:roomId', authenticate, async (req: express.Request, res: express.Response) => {
    const { username, userid } = res.locals;
    const { roomId } = req.params;

    debug(`Accepted request to create ticket for user ${username}, room id ${roomId}`);

    const userRepo = getConnection().getRepository(User);
    const roomRepo = getConnection().getRepository(Room);
    const ticketRepo = getConnection().getRepository(Ticket);

    const user = await userRepo.findOne(userid);
    const room = await roomRepo.findOne(roomId, {
        relations: ['game']
    });

    if (!room) {
        res.status(404);
        res.send({
            error: {
                userMessage: 'Room not found',
                developerMessage: `Room ID ${roomId} not found`,
                code: 404
            }
        })
        res.end();
        return;
    }

    const ticketVal = createTicket();

    let ticket = new Ticket();
    ticket.user = user;
    ticket.room = room;
    ticket.ticket = ticketVal;
    ticket.owner = false;
    room.tickets.push(ticket);
    room.game = room.game;

    await roomRepo.save(room);
    ticket = await ticketRepo.save(ticket);

    debug(`New ticket created:\n ${JSON.stringify(ticket, null, 2)}`);

    res.status(201);
    res.send({
        ...ticket
    });
    res.end();
    return;
});

export default router;