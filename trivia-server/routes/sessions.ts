import * as express from 'express';
import { requiresFields } from '../middleware/validation';
import { getConnection, Session, User } from '../entity';

const debug = require('debug')('trivia-server:routes:sessions');

let router = express.Router();

router.post('/', requiresFields(['username', 'password']), async (req: express.Request, res: express.Response) => {
    debug('About to attempt to get the Session repository');
    const sessionsRepository = getConnection().getRepository(Session);
    debug('Got it');
    debug('About to attempt to get the User repository');
    const usersRepository = getConnection().getRepository(User);
    debug('Got it');
    res.status(200);
    res.send({all: 'good'});
    res.end();
});

export default router;