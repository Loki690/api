import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import Project from '../models/project.model.js';

export const test = (req, res) => {
  res.send('API routes is working!');
};

export const updateUser = async (req, res, next) => {
  try {
    if (!req.params.userId) {
      return next(errorHandler(403, "You're not allowed to update this user"));
    }

    const { userCode, firstName, lastName, password, email, role } = req.body;

    if (password && password.length < 7) {
      return next(errorHandler(400, 'Password must be at least 7 characters'));
    }

    const updateData = {
      userCode,
      firstName,
      lastName,
      email,
      role,
      password: password ? bcryptjs.hashSync(password, 10) : undefined,
    };

    // Remove undefined fields to avoid updating with empty values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateData },
      { new: true }
    );

    const { password: _, ...rest } = updatedUser._doc; // Exclude password from response
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// const validateUsername = (username) => {
//   if (username.length < 5 || username.length > 15) {
//     return "Username must be between 5 and 15 characters";
//   }
//   if (username.includes(" ")) {
//     return "Username cannot contain space";
//   }

//   if (username !== username.toLowerCase()) {
//     return "Username must be a lowercase";
//   }

//   if (!username.match(/^[a-zA-Z0-9]+$/)) {
//     return "Username can only contains letters and number";
//   }
//   return null;
// };

export const deleteUser = async (req, res, next) => {
  // Check if the user is an admin
  if (!req.params.userId) {
    return next(errorHandler(403, 'Only admins are allowed to delete users'));
  }

  try {
    // Perform the deletion
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res.clearCookie('access_token').status(200).json('User has been sign out');
  } catch (error) {
    next(error);
  }
};

export const createUserWithProject = async (req, res, next) => {
  const { userCode, firstName, lastName, password, project, role } = req.body;

  if (!userCode || !firstName || !lastName || !password || !project) {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const existingProject = await Project.findOne({ name: project });

    if (!existingProject) {
      return next(errorHandler(404, 'Project not found'));
    }

    const newUser = new User({
      userCode,
      firstName,
      lastName,
      password: hashedPassword,
      role,
      project: existingProject._id, // Link user to the project by ID
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      user: {
        id: savedUser._id,
        userCode: savedUser.userCode,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role,
      },
      project: {
        id: existingProject._id,
        name: existingProject.name,
        description: existingProject.description,
      },
    });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};

export const getAllProjectUsers = async (req, res, next) => {
  try {
    const projectUsers = await User.find({ project: req.params.id });
    res.status(200).json(projectUsers);
  } catch (error) {
    next(error);
  }
};

export const getUserbyId = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.userId,
      project: req.params.id,
    });
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('project', 'name');
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getSelf = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserProject = async (req, res, next) => {
  const { userId } = req.params;
  const { project } = req.body;

  try {
    // Find the user and update the role
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    user.project = project; // Update role
    await user.save(); // Save changes

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user: { id: user._id, userCode: user.userCode, project: user.project },
    });
  } catch (error) {
    next(error); // Handle errors
  }
};
