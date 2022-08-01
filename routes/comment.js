var express = require("express");
const session = require("express-session");
const { get_details, get_comments, got_comments } = require("./db");
var router = express.Router();

/* GET users listing. */
router.get("/view/:id", function (req, res, next) {
    res.send("abc");
});

router.get("/edit/:id", function (req, res, next) {
    res.send("abc");
});

router.post("/submit",function (req, res, next) {
    
});

module.exports = router;