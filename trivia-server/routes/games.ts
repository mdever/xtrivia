import { Answer, Game, getConnection, Question, User } from '../entity';
import express, { Request, Response } from 'express';
import { requiresFields } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const debug = require('debug')('trivia-server:routes:games');

var router = express.Router();

function validateAnswers(answers: any): string | null {
    if (typeof answers != 'object') {
        return '"questions" must be an array of QuestionDTOs'
    }
    
    const validationErrors = [];
    for (const answer of answers) {
        if (!answer.text) {
            validationErrors.push('answer.text should be a string');
        }

        if (!answer.index && answer.index !== 0) {
            validationErrors.push('answer.index should be a number');
        }

        if (typeof answer.correct != 'boolean') {
            validationErrors.push('answer.correct should be a boolean')
        }

        if (validationErrors.length > 0)
            break;
    }

    if (validationErrors.length > 0) {
        return validationErrors.join(', ');
    } else {
        return null;
    }
}

function validateQuestions(questions: any): string | null {
    if (typeof questions != 'object') {
        return '"questions" must be an array of QuestionDTOs'
    }

    const validationErrors = [];

    for (const question of questions) {
        if (!question.text) {
            validationErrors.push('question.text should be a string');
        }
        if (!question.index && question.index !== 0) {
            validationErrors.push('question.index should be a number');
        }

        if (question.answers) {
            const answerValidationErrors = validateAnswers(question.answers);
            if (answerValidationErrors) {
                validationErrors.concat(answerValidationErrors);
            }
        }

        if (validationErrors.length > 0) 
            break;
    }

    if (validationErrors.length > 0) {
        return validationErrors.join(', ');
    } else {
        return null;
    }
}

router.post('/', authenticate, requiresFields(["name"]), async (req: express.Request, res: express.Response) => {
    const { username, userid } = res.locals;
    const { name, questions } = req.body;
    if (questions) {
        const validationErrors = validateQuestions(questions);
        if (validationErrors) {
            res.status(400);
            res.send({
                error: {
                    userMessage: 'Data validation error',
                    developerMessage: validationErrors
                }
            })
        }
    }

    const userRepository = getConnection().getRepository(User);
    const gameRepository = getConnection().getRepository(Game);
    const questionRepository = getConnection().getRepository(Question);
    const answerRepository = getConnection().getRepository(Answer);

    const user = await userRepository.findOne(userid);

    let game = new Game();
    game.name = name;
    game.owner = user;
    game = await gameRepository.save(game);
    if (questions) {
        for (const questionDTO of questions) {
            let question = new Question();
            question.text = questionDTO.text;
            question.hint = questionDTO.hint;
            question.index = questionDTO.index;
            question.game = game;

            question = await questionRepository.save(question);

            if (question.answers) {
                const answers: Answer[] = [];
                for (const answerDTO of question.answers) {
                    let answer = new Answer();
                    answer.index = answerDTO.index;
                    answer.text = answerDTO.text;
                    answer.question = question;
                    answers.push(answer);
                }

                await answerRepository.save(answers);
            }
        }
    }

    game = await gameRepository.findOne(game.id);

    res.status(201);
    res.send(JSON.stringify(game));
    res.end();
    return;
});

router.get('/:gameId', authenticate, async (req: express.Request, res: express.Response) => {
    const { denmormalize } = req.query;
    const { username, userid } = res.locals;
    const { gameId } = req.params;
    
    const userRepository = getConnection().getRepository(User);
    const gameRepository = getConnection().getRepository(Game);

    const user = await userRepository.findOne(userid);
    const game = await gameRepository.findOne(gameId, {
        relations: ['owner', 'questions', 'questions.answers']
    });

    if (!game) {
        res.status(404);
        res.send({
            error: {
                userMessage: 'Game not found',
                developerMessage: `No game of ID ${gameId} found for user ${username}`,
                code: 404
            }
        })
        res.end();
        return;
    }

    if (user.id !== game.owner.id) {
        res.status(403);
        res.send({
            error: {
                userMessage: 'Unauthorized',
                developerMessage: `User ${username} is unauthorized to GET game ${gameId}`,
                code: 403
            }
        });
        res.end();
        return;
    }

    res.status(200);
    res.send(JSON.stringify(Game.toDTO(game)));
    res.end();
    return;
})

export default router;

