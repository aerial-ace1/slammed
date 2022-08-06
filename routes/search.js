var express = require("express");
var router = express.Router();
var checks = require("./db");

router.get("/", function (req, res, next) {
    res.render("search",{ title: "Search", auth: req.session.auth,});
});

router.post("/", function (req, res, next) {
    callback(res,req)
});

async function callback(res,req){
    let results = await checks.get_name(req.body.search);
    res.render("search",{ title: "Search", auth: req.session.auth,search:req.body.search,results:results})
}
module.exports = router;