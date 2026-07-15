const authService = require("../services/auth");

// REGISTER
exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);

    return res.status(201).json({
      message: "User registered successfully",
       user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    return res.status(200).json({
      message: "Login successful",
      ...result
    });

  } catch (error) {
    return res.status(401).json({
      message: error.message
    });
  }
};

