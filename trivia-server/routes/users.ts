import { getConnection, User } from '../entity';
import express, { Request, Response } from 'express';
import { requiresFields } from '../middleware/validation';
import bcrypt from 'bcrypt';
const debug = require('debug')('trivia-server:routes:users');

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

router.post('/', requiresFields(['username', 'password', 'email']), async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  if (password.length < 6) {
    res.status(400);
    res.send({
      error: {
        userMessage: 'Password must be > 4 characters',
        developerMessage: 'Proposed password too short',
        code: 400
      }
    });
    res.end();
    return;
  }

  const usersRepository = getConnection().getRepository(User);
  const existingUser = await usersRepository.findOne({
    where: {
      username
    }
  });

  if (existingUser) {
    res.status(409);
    res.send({
      error: {
        userMessage: 'Please choose a different username or login',
        developerMessage: 'Proposed username is already existing',
        code: 409
      }
    });
    res.end();
    return;
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      debug('Unable to generate salt: ');
      debug(err);
      res.status(500);
      res.send({
        error: {
          userMessage: 'We\'re sorry, a problem has occurred on the server which has prevented the account creation',
          developerMessage: 'Server Error',
          code: 500
        }
      });
      res.end();
      return;
    }

    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        debug('Unable to hash pw: ');
        debug(err);
        res.status(500);
        res.send({
          error: {
            userMessage: 'We\'re sorry, a problem has occurred on the server which has prevented the account creation',
            developerMessage: 'Server Error',
            code: 500
          }
        });
        res.end();
        return;
      }

      let user = new User();
      user.username = username;
      user.email = email;
      user.salt = salt;
      user.pwHash = hash;
      await usersRepository.save(user);
      user = await usersRepository.findOne({
        where: {
          username
        }
      });
      debug('New user created: ');
      debug(user);
      res.status(201);
      res.end();
      return;
    })
  });
});

module.exports = router;
