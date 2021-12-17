import express from 'express';
import { requiresFields } from '../middleware/validation';
import { authenticate, authorizeUserOwnsGame } from '../middleware/auth';
import { getConnection } from 'typeorm';
import { User, Game, Question } from '../entity';

const router = express.Router();

router.post('/:gameId', authenticate, authorizeUserOwnsGame('gameId'), requiresFields(["text", "index"]), async (req, res) => {
    const { username, userid } = res.locals;
    const { gameId } = req.params;
    const { index, text, hint, answers } = req.body;

    const userRepository = getConnection().getRepository(User);
    const gameRepository = getConnection().getRepository(Game);
    const questionRepository = getConnection().getRepository(Question);

    const user = await userRepository.findOne(userid);
    const game = await gameRepository.findOne(gameId, {
        relations: ['owner', 'answers']
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

    res.status(201);
    res.send({
        ...question
    });
    res.end();
    return;
})

router.get('/:gameId/questions', authenticate, authorizeUserOwnsGame('gameId'), async (req, res) => {
    const { username, userid } = res.locals;
    const { gameId } = req.params;

    const userRepository = getConnection().getRepository(User);
    const gameRepository = getConnection().getRepository(Game);
    const questionRepository = getConnection().getRepository(Question);

    const user = await userRepository.findOne(userid);
    const game = await gameRepository.findOne(gameId, {
        relations: ['questions']
    });

    res.status(200);
    res.send({
        ...game.questions
    });
    res.end();
    return;
});

router.get('/questions/:questionId', authenticate, authorizeUserOwnsQuestion('questionId'), async (req, res) => {

})