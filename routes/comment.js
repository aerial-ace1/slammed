var express = require("express");
const session = require("express-session");
var checks = require("./db");
var router = express.Router();

/* GET users listing. */
router.get("/:user/new", function (req, res, next) {
    if (req.session.auth){
        new_callback(req,res)
    }
    else{
        req.session.regerrorsextra = { msg: "Please login" };
        res.redirect("../../login");
    }
});

router.get("/:user/view/:id", function (req, res, next) {
    if (req.session.auth){
        view_callback(req,res);
    }
    else{
        req.session.regerrorsextra = { msg: "Please login" };
        res.redirect("../../../login");
    }
});

router.get("/:user/edit/:id", function (req, res, next) {
    if (req.session.auth){
        edit_callback(req.params.id,req,res);
    }
    else{
        req.session.regerrorsextra = { msg: "Please login" };
        res.redirect("../../../login");
    }
});

router.post("/:user/submit",function (req, res, next) {
    if (req.session.auth){
        submit_callback(req.params.id,req,res);
    }
    else{
        req.session.regerrorsextra = { msg: "Please login" };
        res.redirect("../../login");
    }
});

async function new_callback(req,res){
    let ided_comment = await checks.check_comments(req);
    if (ided_comment[0] === undefined){
        res.render('newcomment',{user : req.params.user})
    }
    else{
        res.redirect(`/comment/${req.params.id}/edit/${ided_comment[0].id}`)
    }
}
async function view_callback(req,res){
    let ided_comment = await checks.id_comments(req.params.id);
    if (ided_comment[0] === undefined){
        console.log("a")
        res.render("error");
    }
    else{
        if (req.session.auth === ided_comment[0].writer || req.session.auth === ided_comment[0].reader){
            res.render("comment",{comment : ided_comment[0]})
        }
        else{
            res.render("error");
            console.log("b")
        }
    }
}

async function edit_callback(id,req,res){
    let ided_comment = await checks.id_comments(id);
    if (ided_comment[0] === undefined){
        res.render("error");
    }
    else{
        if (req.session.auth === ided_comment[0].writer){
            res.render("newcomment",{comment : ided_comment[0]})
        }
        else{
            res.render("error");
        }
    }
}

async function submit_callback(id,req,res){
    let ided_comment = await checks.add_comments(req,res);
    if (ided_comment[0] === undefined){
        res.render("error");
    }
    else{
        res.redirect(`comments/${ided_comment[0].reader}/view/${ided_comment[0].id}`)
    }
}
module.exports = router;