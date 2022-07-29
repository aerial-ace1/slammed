var express = require('express');
const { check } = require('express-validator/check');
var router = express.Router();
var checks = require('./db')

var creError = [{msg:"Invalid Credentials"}]


router.get('/', function(req, res, next) {
  uid = "106121005@g.com"
  pwd = "abcd123"
  checks.check_username(uid,pwd);
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login', success: req.session.success, errors: req.session.errors });
  req.session.errors = null;
});

router.post('/login', function(req, res, next) {
  req.check('email', 'Invalid email address').isEmail();
  req.check('password', 'Password is invalid').isLength({min: 4}).equals(req.body.confirmPassword);

  var errors = req.validationErrors();
  if (errors) {
    req.session.errors = errors;
    console.log(req.session.errors)
    console.log(errors);
    req.session.success = false;
  } else {
    req.session.success = true;
    //console.log("akndkeqd")
    //const obj = JSON.parse(JSON.stringify(req.body));
    //console.log(obj.password)
    //let profile = checks.check_username(req.body.email,req.body.password);
    //console.log(profile);
    callback(req,res);
    return 0;
  }
  res.redirect('/login');
  console.log('b');
  return 0;
});

async function callback(req,res) {
  
  let profile = await checks.check_username(req.body.email, req.body.password);
  if (profile[0] == undefined) {
    req.session.success = false;
    req.session.errors = creError;
    res.redirect('/login');
  }
  else{
    res.redirect(`/users/${profile[0].uid}`)
  }
}

module.exports = router;