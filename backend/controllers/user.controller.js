const userService = require("../services/user.service");
const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/user.repository");
const mongoose = require("mongoose");

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    // Return only safe fields
    const safeUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    res.status(201).json({message:"User created successfully", user:safeUser});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    // Map each user to only return safe fields
    const safeUsers = users.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }));

    res.status(200).json({message:"Users retrieved successfully", users:safeUsers});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//there is a problem in here: but when i test with the update profile it works fine, but when i test with get user by id it gives me an error: invalid user id, but the id is valid, i think the problem is in the mongoose.Types.ObjectId.isValid(id) function, because when i test with a random string it gives me the same error, but when i test with a valid id it gives me the same error, so i think the problem is in the function, can you check it?  
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const user = await userRepository.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//my account info:
exports.getProfile = async (req, res) => {
  try {
    // req.user.id comes from JWT
    const user = await userRepository.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return only safe info 
    res.status(200).json({
      message: "Current user info",
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        bio: user.bio,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const { username, email, password, role, bio, profilePicture } = req.body;

    const updateData = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (bio !== undefined) updateData.bio = bio;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
    if (password) {
      // Hash password before storing
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await userRepository.updateById(userId, updateData);

    // Return safe user data
    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture
      }
    });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
