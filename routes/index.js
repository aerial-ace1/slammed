var express = require("express");
var router = express.Router();
var checks = require("./db");

var creError = [{ msg: "Invalid Credentials" }];
var userError = { msg: "Pick Another Username" };
var deptError = { msg: "Invalid Department" };
var hostelError = { msg: "Invalid Hostel" };
var departments = [
  { no: 1, name: "CSE" },
  { no: 2, name: "ECE" },
];
var hostel = [
  { no: 1, name: "Zircon" },
  { no: 1, name: "Opal" },
];

/* var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, './public/images/')    
  },
  filename: (req, file, callBack) => {
      callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})
var upload = multer({
  storage: storage
}); */

router.get("/", function (req, res, next) {
  res.render("index", { title: "Slammed", auth: req.session.auth });
});

router.get("/logout", function (req, res, next) {
  req.session.auth = null;
  res.redirect("../");
});

/* GET home page. */
router.get("/login", function (req, res, next) {
  if (req.session.auth != null) {
    res.redirect(`/users/${req.session.auth}`);
    req.session.errors = null;
  } else {
    res.render("login", {
      auth: req.session.auth,
      title: "Login",
      success: req.session.success,
      errors: req.session.errors,
    });
    req.session.errors = null;
  }
});

router.post("/login", function (req, res, next) {
  req.check("email", "Invalid email address").isEmail();
  req.check("password", "Password is invalid").isLength({ min: 4 });

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

router.get("/login/register", function (req, res, next) {
  if (req.session.auth) {
    req.session.regerrors = null;
    req.session.regerrorsextra = null;
    res.redirect(`/users/${req.session.auth}`);
  } else {
    res.render("register", {
      title: "Register",
      auth: req.session.auth,
      departments: departments,
      hostel: hostel,
      errors: req.session.regerrors,
      errors2: req.session.regerrorsextra,
    });
  }
});

router.post(
  "/login/register",
  /* upload.single('image'), */ function (req, res, next) {
    req.session.regerrors = null;
    req.session.regerrorsextra = null;
    if (req.session.auth) {
      res.redirect(`/users/${req.session.auth}`);
      return 0;
    }

    req.check("email", "Invalid email address").isEmail();
    req.check("name", "Name is not alpha").isAlpha();
    req
      .check("password", "Password is invalid")
      .isLength({ min: 4 })
      .equals(req.body.confirmPassword);
    req.check("hostel", "Pick a hostel").notEmpty();
    req.check("department", "Pick a Department").notEmpty();
    req.session.regerrors = req.validationErrors();
    departments_in = 0;
    hostel_in = 0;
    for (i = 0; i < departments.length; i++) {
      if (departments[i].no == req.body.department) {
        departments_in = 1;
      }
    }
    if (departments_in == 1) {
      req.session.regerrors[5] = deptError;
    }
    for (i = 0; i < hostel.length; i++) {
      if (hostel[i].no == req.body.hostel) {
        hostel_in = 1;
      }
    }
    if (hostel_in == 1) {
      req.session.regerrors[6] = hostelError;
    }
    callback2(req, res);
  }
);

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

async function callback2(req, res) {
  let result = await checks.get_details(req.body.email);
  if (
    result[0] === undefined &&
    req.session.regerrors === false &&
    req.session.regerrorsextra === null
  ) {
    req.session.regerrorsextra = await checks.adduser(req.body);
    if (req.session.regerrorsextra) {
      req.session.success = true;
      req.session.auth = req.body.email;
      res.redirect(`/users/${req.body.email}`);
    } else {
      res.redirect("/login/register");
    }
  } else {
    if (result[0] != undefined) {
      if (result[0].uid === req.body.email) {
        req.session.regerrors[7] = userError;
      }
    }
    res.redirect("/login/register");
  }
}

module.exports = router;
