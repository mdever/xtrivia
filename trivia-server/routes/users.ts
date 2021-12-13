var express = require('express');
var router = express.Router();

import { getConnection, User } from '../entity';
import { Request, Response } from 'express';

/* GET users listing. */
router.get('/', async function(req: Request, res: Response, next: any) {
  const usersRepository = getConnection().getRepository(User)
  const users = await usersRepository.find();
  res.status(200);
  res.write('respond with a resource');
  res.write(users.toString());
  res.end();
});

module.exports = router;
