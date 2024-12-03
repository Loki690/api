import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

// Controller for signing up
export const signup = async (req, res, next) => {
  const { userCode, firstName, lastName, password, role } = req.body;

  // Validate required fields
  if (
    !userCode ||
    !firstName ||
    !lastName ||
    !password ||
    userCode === '' ||
    firstName === '' ||
    lastName === '' ||
    password === ''
  ) {
    return next(errorHandler(400, 'All fields are required'));
  } else if (password.length < 7) {
    return next(errorHandler(400, 'Password must be at least 7 characters'));
  }

  // Validate role
  const validRoles = [
    'Admin',
    'Head',
    'Inventory',
    'Crew',
  ];
  if (role && !validRoles.includes(role)) {
    return next(errorHandler(400, 'Invalid role specified'));
  }

  // Hash the password
  const hashedPassword = bcryptjs.hashSync(password, 10);

  // Create new user
  const newUser = new User({
    userCode,
    firstName,
    lastName,
    password: hashedPassword,
    role: role || 'Crew', // Default to 'Crew' if no role is provided
  });

  try {
    await newUser.save();
    res.status(201).json('User Created Successfully');
  } catch (error) {
    next(error);
  }
};

// Controller for signing in
export const signin = async (req, res, next) => {
  const { userCode, password } = req.body;

  // Validate required fields
  if (!userCode || !password || userCode === '' || password === '') {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    // Find the user by userCode
    const validUser = await User.findOne({ userCode });
    if (!validUser) {
      return next(errorHandler(404, 'User not found!'));
    }

    // Check if the password is valid
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid credentials'));
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: validUser._id, role: validUser.role },
      process.env.JWT_SECRET
    );

    // Exclude the password from the response
    const { password: pass, ...rest } = validUser._doc;

    // Send the response with a cookie containing the token
    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Google Authentication
export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl, role } = req.body;

  // Validate role (optional, defaults to 'Crew')
  const validRoles = [
    'Admin',
    'Head',
    'Inventory',
    'Crew',
  ];
  if (role && !validRoles.includes(role)) {
    return next(errorHandler(400, 'Invalid role specified'));
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      // User exists, generate a token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      // Create a new user with a generated password
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        userCode: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1] || '',
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        role: role || 'Crew', // Default to 'Crew' if no role is provided
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
