const router = require("express").Router()

const loginController = require("../api/controller/UserController");
const auth = require("../api/middleware/Auth")

router.post("/login", loginController.login);
router.post("/register", loginController.register);
router.patch("/user/update/:id", auth, loginController.update);
router.delete("/user/delete/:id", auth, loginController.deleteAcc);
router.post("/user/2fa/:id", auth, loginController.twoFA);
router.get("/user/:id", auth, loginController.getUser);

module.exports = router;
