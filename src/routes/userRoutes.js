const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


router.post("/users", userController.createUser);
router.post("/auth/login", userController.loginUser);


router.get("/users/:id", userController.getUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);


router.patch("/users/:id/activate", userController.activateUser);
router.patch("/users/:id/deactivate", userController.deactivateUser);

module.exports = router;
