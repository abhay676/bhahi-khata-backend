const router = require("express").Router();

const loginController = require("../api/controller/UserController");
const auth = require("../api/middleware/Auth");
router.post("/login", loginController.login);
router.post("/register", loginController.register);
router.patch("/user/update", auth, loginController.update);
router.delete("/user/delete", auth, loginController.deleteAcc);
// router.post("/user/2fa", auth, loginController.twoFA);
router.get("/user", auth, loginController.getUser);

module.exports = router;
