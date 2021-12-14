import { getConnection } from '../entity';
import { Request, Response } from 'express';
import { Session } from '../entity';
const debug = require('debug')('trivia-server:middleware');

const PREFIX = 'Bearer ';

export const authenticate = async (req: Request, res: Response, next: any) => {
    const sessionsRepository = getConnection().getRepository(Session);

    let authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401);
        res.end();
        return;
    }

    if (authHeader.indexOf(PREFIX) != 0) {
        res.status(401);
        res.end();
        return;
    } 

    const token = authHeader.slice(PREFIX.length);

    try {
        const session = await sessionsRepository.findOne({
            where: {
                token
            },
            relations: ['user']
        });

        if (!session) {
            res.status(401);
            res.end();
            return;
        }

        const now = new Date();
        let expiresAt = new Date(session.expiresAt);

        if (now > expiresAt) {
            debug(`User ${session.user.username}s token has expired. Deleting the session.`);
            sessionsRepository.delete(session.id);

            res.status(401);
            res.send({
                error: {
                    userMessage: 'Your session has expired. Please login again.',
                    developerMessage: 'Access token has expired',
                    code: 302
                }
            })
            res.end();
            return;
        }

        res.locals.username = session.user.username;
        res.locals.userid   = session.user.id;
        next();

    } catch (err) {
        debug('An error occurred retrieving user session: ');
        debug(err);
        res.status(500);
        res.end();
        return;
    }
}