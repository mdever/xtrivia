import * as express from 'express';
import { requiresFields } from '../middleware/validation';
import { getConnection, Session, User } from '../entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { authenticate } from '../middleware/auth';


const debug = require('debug')('trivia-server:routes:sessions');

let router = express.Router();

router.post('/', requiresFields(['username', 'password']), async (req: express.Request, res: express.Response) => {

    const { username, password } = req.body;

    const sessionsRepository = getConnection().getRepository(Session);
    const usersRepository = getConnection().getRepository(User);

    const existingSessions = await sessionsRepository.find({
        where: {
            user: { 
                username 
            }
        },
        relations: ['user']
    });


    if (existingSessions && existingSessions.length > 0) {
        const user = existingSessions[0].user;
        sessionsRepository.delete({ user })
    }

    const user = await usersRepository.findOne({
        where: {
            username
        }
    });

    if (!user) {
        res.status(404);
        res.send({
            error: {
                userMessage: 'Sorry we could not find a username/password with that combination. Please check your spelling and try again.',
                developerMessage: 'Username/Password not found',
                code: 404
            }
        })
        res.end();
        return;
    }

    const { pwHash, salt } = user;

    const result = await bcrypt.compare(password, pwHash);
    if (!result) {
        res.status(401);
        res.send({
            error: {
                userMessage: 'Sorry we could not find a username/password with that combination. Please check your spelling and try again.',
                developerMessage: 'Username/Password not found',
                code: 404
            }
        });
        res.end();
        return;
    }

    let token = crypto.randomBytes(128).toString('hex');

    let session = new Session();
    session.user = user;
    session.token = token;
    let expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 4);
    session.expiresAt = expirationDate;
    sessionsRepository.save(session);
    res.status(201);
    res.send({
        token,
        expires: expirationDate
    });
    res.end();

});

router.delete('/', authenticate, async (req: express.Request, res: express.Response) => {
    const { username } = res.locals;

    const sessionsRepository = getConnection().getRepository(Session);

    const sessions = await sessionsRepository.find({
        where: {
            user: {
                username
            }
        }
    });

    if (sessions && sessions.length === 0) {
        res.status(200);
        res.end();
        return;
    }

    await sessionsRepository.delete(sessions.map(s => s.id));

    res.status(200);
    res.end();
    return;
})

export default router;