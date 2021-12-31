import express from 'express';
import { requiresFields } from '../middleware/validation';
import { authenticate, authorizeUserOwnsGame, authorizeUserOwnsQuestion } from '../middleware/auth';
import { getConnection } from '../entity';
import { User, Game, Question } from '../entity';

const debug = require('debug')('trivia-server:routes:questions');

const router = express.Router();

router.post('/games/:gameId/questions', authenticate, authorizeUserOwnsGame('gameId'), requiresFields(["text", "index"]), async (req, res) => {
    const { username, userid } = res.locals;
    const { gameId } = req.params;
    const { index, text, hint, answers } = req.body;

    const userRepository = getConnection().getRepository(User);
    const gameRepository = getConnection().getRepository(Game);
    const questionRepository = getConnection().getRepository(Question);

    const user = await userRepository.findOne(userid);
    let game = await gameRepository.findOne(gameId, {
        relations: ['owner', 'questions', 'questions.answers']
    });

    if (!game) {
        res.status(404);
        res.send({
            error: {
                userMessage: 'Invalid game ID',
                developerMessage: `Game ID ${gameId} not found`,
                code: 404
            }
        });
        res.end();
        return;
    }

    if (game.owner.id !== user.id) {
        res.status(403);
        res.send({
            error: {
                userMessage: 'Unauthorized',
                developerMessage: 'Unauthorized',
                code: 403
            }
        })
    }
    let question = new Question();
    question.index = index;
    question.text = text;
    question.hint = hint;
    question.answers = answers || []
    game.questions.push(question);
    game = await gameRepository.save(game);

    res.status(201);
    res.send({
        ...question
    });
    res.end();
    return;
})

router.get('/games/:gameId/questions', authenticate, authorizeUserOwnsGame('gameId'), async (req, res) => {
    const { username, userid } = res.locals;
    const { gameId } = req.params;

    const gameRepository = getConnection().getRepository(Game);

    const game = await gameRepository.findOne(gameId, {
        relations: ['questions']
    });

    const questions = game.questions.sort((q1, q2) => q1.index - q2.index);

    res.status(200);
    res.send([
        ...questions
    ]);
    res.end();
    return;
});

router.get('/questions/:questionId', authenticate, authorizeUserOwnsQuestion('questionId'), async (req, res) => {
    const { questionId } = req.params;
    const questionRepo = getConnection().getRepository(Question);
    const { withAnswers } = req.query;
    let question;
    if (withAnswers) {
        question = questionRepo.findOne(questionId);
    } else {
        question = questionRepo.findOne(questionId, {
            relations: ['answers']
        });
    }


    if (!question) {
        res.status(404);
        res.send({
            error: {
                userMessage: 'No question found',
                developerMessage: `No question with ID ${questionId} found`,
                code: 404
            }
        });
        res.end();
        return;
    }

    return {
        ...question
    }
})

export default router;