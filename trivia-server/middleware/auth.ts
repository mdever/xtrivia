import { Game, getConnection, Question, User } from '../entity';
import { Request, Response } from 'express';
import { Session } from '../entity';
const debug = require('debug')('trivia-server:middleware:auth');

const PREFIX = 'Bearer ';

export const authenticate = async (req: Request, res: Response, next: any) => {
    const sessionsRepository = getConnection().getRepository(Session);
    const usersRepository = getConnection().getRepository(User);

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
            }
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

        const user = await usersRepository.findOne(session.user.id);

        res.locals.username = user.username;
        res.locals.userid   = user.id;
        next();

    } catch (err) {
        debug('An error occurred retrieving user session: ');
        debug(err);
        res.status(500);
        res.end();
        return;
    }
};

export const authorizeUserOwnsGame = (key: string) => {
    return async (req: Request, res: Response, next: any) => {
        const { username, userid } = res.locals;
        const gameId = req.params[key];

        const userRepository = getConnection().getRepository(User);
        const gameRepository = getConnection().getRepository(Game);
        
        const user = await userRepository.findOne(userid);
        const game = await gameRepository.findOne(gameId, {
            relations: ['owner']
        });

        if (user.id !== game.owner.id) {
            res.status(403);
            res.send({
                error: {
                    userMessage: 'Unauthorized',
                    developerMessage: `User ID ${userid} is unauthorized to access game id ${gameId}`,
                    code: 403
                }
            });
            res.end();
            return;
        }

        next();
    };
};

export const authorizeUserOwnsQuestion = (key: string) => {
    return async (req: Request, res: Response, next: any) => {
        const { username, userid } = res.locals;
        const questionId = req.params[key];

        const userRepository = getConnection().getRepository(User);
        const questionRepository = getConnection().getRepository(Question);
        
        const user = await userRepository.findOne(userid);
        const question = await questionRepository.findOne(questionId, {
            relations: ['game', 'game.owner']
        });

        if (user.id !== question.game.owner.id) {
            res.status(403);
            res.send({
                error: {
                    userMessage: 'Unauthorized',
                    developerMessage: `User ID ${userid} is unauthorized to access question id ${questionId}`,
                    code: 403
                }
            });
            res.end();
            return;
        }

        next();
    };
};