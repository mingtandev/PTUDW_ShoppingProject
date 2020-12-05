var express = require("express");
var router = express.Router();
const userController = require("../controllers/user.controller");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("./../middlewares/auth.middleware");

router.get("/dashboard", userController.getDashboard);

router.get("/wishlist", userController.getWishlist);

router.get("/checkout", userController.getCheckout);

router.get("/auth", userController.getAuth);

router.get("/register", checkNotAuthenticated, userController.getSignUp);
router.post("/register", checkNotAuthenticated, userController.postSignUp);
router.get("/login", checkNotAuthenticated, userController.getSignIn);
router.post("/login", checkNotAuthenticated, userController.postSignIn);
router.post("/logout", checkAuthenticated, userController.postSignOut);
router.get("/confirm/:token", checkNotAuthenticated, userController.getConfirm);
router.post("/resend", checkNotAuthenticated, userController.postResend);
router.get("/recovery", checkNotAuthenticated, userController.getRecovery);
router.post("/recovery", checkNotAuthenticated, userController.postRecovery);
router.get("/reset/:token", checkNotAuthenticated, userController.getReset);
router.post("/reset/:token", checkNotAuthenticated, userController.postReset);
router.get("/:id/info", checkAuthenticated, userController.getInfo);
router.patch("/:id", checkAuthenticated, userController.patchUpdate);

router.get("/", checkAuthenticated, userController.getAll);
router.get("/:id", checkAuthenticated, userController.getOne);
router.delete("/:id", checkAuthenticated, userController.deleteOne);

router.post(
  "/forgot",
  checkNotAuthenticated,
  userController.postForgotPassword
);
router.get(
  "/forgot/:token",
  checkNotAuthenticated,
  userController.getResetPassword
);
 
router.post("/reset", checkNotAuthenticated, userController.postResetPassword);
 
router.get(
  "/account/dashboard",
  checkAuthenticated,
  userController.getDashboard
);
router.put(
  "/account/password",
  checkAuthenticated,
  userController.putUpdatePassword
);
 
router.put("/account/info", checkAuthenticated, userController.putUpdateInfo);
 
router.post("/resend", checkNotAuthenticated, userController.postResend);
router.get("/recovery", checkNotAuthenticated, userController.getRecovery);
router.post("/recovery", checkNotAuthenticated, userController.postRecovery);
router.get("/reset/:token", checkNotAuthenticated, userController.getReset);
router.post("/reset/:token", checkNotAuthenticated, userController.postReset);
router.get("/:id/info", checkAuthenticated, userController.getInfo);
router.patch("/:id", checkAuthenticated, userController.patchUpdate);


module.exports = router;
