import {Response, Request, NextFunction} from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import signupSchema from '../schemas/signupSchema';
import generateTokens from '../utils/generateTokens';

// @route  POST /api/user/signup
const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
  const {username, password} = req.body;

  // Check username and password exist
  if (!username || !password) {
    res.status(400);
    return next(new Error("Missing credentials"));
  }

  // Check valid username and password
  const { error } = signupSchema.validate({ username, password });
  if (error) {
    res.status(400);
    return next(new Error(error.details[0].message));
  }

  // Check username taken
  const existingUser = await User.findOne({where: {username}});
  if (existingUser !== null) {
    res.status(400);
    return next(new Error("The username is taken"));
  }

  // Store user and password in database
  const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());
  const newUser = await User.create({username, password: hashedPassword});

  if (newUser === null) {
    res.status(400);
    return next(new Error("Something went wrong while creating a new account"));
  }

  res.status(200).json({error: false});
}

// @route  POST /api/user/login
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    return next(new Error("Enter a username and password"));
  }

  // Check username exists
  const user = await User.findOne({where: {username}});
  if (user === null) {
    res.status(400);
    return next(new Error("The username does not exist"));
  }

  // Compare given password with stored password
  if (!await bcrypt.compare(password, user.password)) {
    res.status(400);
    return next(new Error("The password is incorrect"));
  }

  // Sign and send tokens
  try {
    const {accessToken, refreshToken} = await generateTokens(user);
    res.status(200).json({
      error: false,
      accessToken, 
      refreshToken
    });
  } catch (err) {
    res.status(400);
    return next(err);
  }
}

export {signUpUser, loginUser};