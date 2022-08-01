var express = require("express");
const { check } = require("express-validator/check");
var router = express.Router();
var checks = require("./db");

var creError = [{ msg: "Invalid Credentials" }];

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET home page. */
router.get("/login", function (req, res, next) {
  if (req.session.auth != null) {
    res.redirect(`/users/${req.session.auth}`);
    req.session.errors = null;
  } else {
    res.render("login", {
      title: "Login",
      success: req.session.success,
      errors: req.session.errors,
    });
    req.session.errors = null;
  }
});

router.post("/login", function (req, res, next) {
  req.check("email", "Invalid email address").isEmail();
  req
    .check("password", "Password is invalid")
    .isLength({ min: 4 })
    .equals(req.body.confirmPassword);

  var errors = req.validationErrors();
  if (errors) {
    req.session.errors = errors;
    req.session.success = false;
  } else {
    req.session.success = true;
    callback(req, res);
    return 0;
  }
  res.redirect("/login");
  return 0;
});

async function callback(req, res) {
  let profile = await checks.check_username(req.body.email, req.body.password);
  if (profile[0] == undefined) {
    req.session.success = false;
    req.session.errors = creError;
    res.redirect("/login");
  } else {
    req.session.auth = profile[0].uid;
    res.redirect(`/users/${profile[0].uid}`);
  }
}

module.exports = router;
