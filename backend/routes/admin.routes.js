const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const { validateRegister } = require("../middlewares/validation.middleware");

router.post("/", authMiddleware, roleMiddleware("admin"), validateRegister, userController.createUser);
router.get("/", authMiddleware, roleMiddleware("admin"), userController.getAllUsers);
router.get("/:id", authMiddleware, roleMiddleware("admin"), userController.getUserById);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), userController.deleteUser);

module.exports = router;
