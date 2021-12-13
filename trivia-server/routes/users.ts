import { getConnection, User } from '../entity';
import express, { Request, Response } from 'express';

var router = express.Router();


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
