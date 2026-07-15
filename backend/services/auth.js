const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");
//register logic:
exports.register = async (data) => {
  const existingUser = await userRepository.findByEmail(data.email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await userRepository.create({
    username: data.username,
    email: data.email,
    password: hashedPassword
  });

  return user;
};
//login logic:
//the server will check if the email exists in the database,
//  then compare the provided password with the stored hashed password.
//  If they match, it will generate a JWT token for authentication.
exports.login = async (email, password) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id , role: user.role},
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token };
};

