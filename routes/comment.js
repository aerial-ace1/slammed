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
        submit_new_callback(req,res);
    }
    else{
        req.session.regerrorsextra = { msg: "Please login" };
        res.redirect("../../login");
    }
});

router.post("/:user/submit/:id",function (req, res, next) {
    if (req.session.auth){
        submit_callback(req,res);
    }
    else{
        req.session.regerrorsextra = { msg: "Please login" };
        res.redirect("../../../login");
    }
});

router.get("/:user/delete/:id",function (req, res, next) {
    if (req.session.auth){
        delete_callback(req,res);
    }
    else{
        req.session.regerrorsextra = { msg: "Please login" };
        res.redirect("../../../login");
    }
});

async function new_callback(req,res){
    let ided_comment = await checks.check_comments(req);
    if (ided_comment[0] === undefined){
        res.render('newcomment',{title: "New Comment", auth: req.session.auth,user : req.params.user})
    }
    else{
        res.redirect(`/comment/${req.params.user}/edit/${ided_comment[0].id}`)
    }
}
async function view_callback(req,res){
    let ided_comment = await checks.id_comments(req.params.id);
    if (ided_comment[0] === undefined){
        console.log("a")
        res.render("error",{title: "Error", auth: req.session.auth,});
    }
    else{
        if (req.session.auth === ided_comment[0].writer || req.session.auth === ided_comment[0].reader){
            let user = await verify(req,ided_comment[0].writer)
            res.render("comment",{title: "Comment", auth: req.session.auth,comment : ided_comment[0],user:user})
        }
        else{
            res.render("error",{title: "Error", auth: req.session.auth,});
            console.log("b")
        }
    }
}

async function edit_callback(id,req,res){
    let ided_comment = await checks.id_comments(id);
    if (ided_comment[0] === undefined){
        res.render("error",{title: "Error", auth: req.session.auth,});
    }
    else{
        if (req.session.auth === ided_comment[0].writer){
            res.render("newcomment",{title: "New Comment", auth: req.session.auth,comment : ided_comment[0]})
        }
        else{
            res.render("error",{title: "Error", auth: req.session.auth,});
        }
    }
}

async function submit_callback(req,res){
    if(req.params.id){
        let ided_comment = await checks.id_comments(req.params.id);
        if( req.session.auth === ided_comment[0].writer){
            let edit_comment = await checks.edit_comments(req);
            res.redirect(`/comment/${ided_comment[0].reader}/view/${ided_comment[0].id}`)  
        }
        else{
            res.render("error",{title: "Error", auth: req.session.auth,});
        }   
    }
    else{
        res.render("error",{title: "Error", auth: req.session.auth,});
        
        }
    }

async function submit_new_callback(req,res){
    let made_comment = await checks.add_comments(req,res);
    if (made_comment){
        res.redirect(`../../users/${req.session.auth}`)
        
    }
    else{
        res.render("error",{title: "Error", auth: req.session.auth,});
    }
}
async function delete_callback(req,res){
    let delete_comm = checks.delete_comments(req);
    if (delete_comm){
        res.redirect(`../../../users/${req.session.auth}`)
    }
    else{
        res.render("error",{title: "Error", auth: req.session.auth,});
    }
}

function verify(req, id) {
    return new Promise((resolve,) => {
      (req.session.auth === id) ? resolve(true) : resolve(false);
    });
}


module.exports = router;