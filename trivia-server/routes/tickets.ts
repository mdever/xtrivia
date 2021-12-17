import express from 'express';
import { authenticate } from '../middleware/auth';
import { requiresFields } from '../middleware/validation';

const debug = require('debug')('trivia-server:routes:tickets');

const router = express.Router();

router.post('/:roomId', authenticate, async (req: express.Request, res: express.Response) => {

});

export default router;