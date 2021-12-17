import express from 'express';
import { requiresFields } from '../middleware/validation';
import { authenticate, authorizeUserOwnsGame } from '../middleware/auth';

const debug = require('debug')('trivia-server:routes:rooms');



const router = express.Router();

router.post('/games/:gameId/rooms', authenticate, authorizeUserOwnsGame('gameId'), requiresFields(['name']), async (req: express.Request, res: express.Response) => {

})

export default router;