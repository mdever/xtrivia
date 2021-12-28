import express from 'express';
import { requiresFields } from '../middleware/validation';
import { authenticate, authorizeUserOwnsGame, authorizeUserOwnsQuestion } from '../middleware/auth';
import { Question, Answer } from '../entity';
import { getConnection } from '../entity';

const debug = require('debug')('trivia-server:routes:answers');

const router = express.Router();

router.post('/games/:gameId/questions/:questionId/answers', authenticate, authorizeUserOwnsGame('gameId'), requiresFields(['index', 'text', 'correct']), async (req: express.Request, res: express.Response) => {
    const { questionId } = req.params;
    const { index, text, correct } = req.body;
    const { username, userid } = res.locals;

    const questionRepo = getConnection().getRepository(Question);
    const answerRepo   = getConnection().getRepository(Answer);
    let question = await questionRepo.findOne(questionId, {
        relations: ['answers']
    });

    if (!question) {
        res.status(404);
        res.send({
            error: {
                userMessage: 'No Question found',
                developerMessage: `No Question with ID ${questionId} found`,
                code: 404
            }
        })
    }

    let answer = new Answer();
    answer.text = text;
    answer.index = index;
    answer.correct = correct;
    answer.question = question;
    answer = await answerRepo.save(answer);

    res.status(201);
    res.send({
        ...answer
    })
    res.end();
    return;
});

router.get('/games/:gameId/questions/:questionId/answers', authenticate, authorizeUserOwnsGame('gameId'), async (req: express.Request, res: express.Response) => {
    const { username, userid } = res.locals;
    const { gameId, questionId } = req.params;
    
    const questionsRepository = getConnection().getRepository(Question);

    const question = await questionsRepository.findOne(questionId, {
        relations: ['answers']
    });

    if (!question) {
        res.status(404);
        res.send({
            error: {
                userMessage: 'No Question found',
                developerMessage: `No question with ID ${questionId} found`,
                code: 404
            }
        });
        res.end();
        return;
    }

    const answers = question.answers;

    res.status(200);
    res.send([
        ...answers
    ]);
    res.end();

    return;
});

export default router;