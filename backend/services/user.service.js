const userRepository = require("../repositories/user.repository");

exports.createUser = async (data) => {
  // Business logic example:
  if (!data.username || !data.email) {
    throw new Error("Username and email are required");
  }

  return await userRepository.create(data);
};

exports.getAllUsers = async () => {
  return await userRepository.findAll();
};

exports.getUserById = async (id) => {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

exports.deleteUser = async (id) => {
  const user = await userRepository.deleteById(id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
