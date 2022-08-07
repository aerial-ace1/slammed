var express = require("express");
var router = express.Router();
var checks = require("./db");

router.get("/:user", function (req, res, next) {
    if (req.session.auth){
        find_callback(req,res);
        console.log("a")
    }
    else {
        res.redirect("../../login");
    }
})

router.post("/:user/check", function (req, res, next){
    if (req.session.auth)    
        if (req.session.auth === req.params.user){
            res.json([{friend : "none"}])
        }
        else{
            check_callback(req,res);
        }
    else{
        res.json([{friend : "none"}])
    }
})

router.get("/:user/send", function (req, res, next){
    if (req.session.auth)    
        if (req.session.auth === req.params.user){
            res.redirect(`../../../users/${req.params.user}`)
        }
        else{
            send_callback(req,res);
        }
    else{
        res.redirect("../../login");
    }
})

router.get("/:user/accept", function (req, res, next){
    if (req.session.auth)    
        if (req.session.auth === req.params.user){
            res.redirect(`../../../users/${req.params.user}`)
        }
        else{
            accept_callback(req,res);
        }
    else{
        res.redirect("../../login");
    }
})

router.get("/:user/remove", function (req, res, next){
    if (req.session.auth)    
        if (req.session.auth === req.params.user){
            res.redirect(`../../../users/${req.params.user}`)
        }
        else{
            remove_callback(req,res);
        }
    else{
        res.redirect("../../login");
    }
})

router.get("/:user/connections", function (req, res, next){
    if (req.session.auth)    
        if (req.session.auth === req.params.user){
            res.json([{level : 0}])
        }
        else{
            connections_callback(req,res);
        }
    else{
        res.redirect("../../../login");
    }
})

async function find_callback(req,res){
    let friends = await checks.find_friend(req)
    friends.reverse();
    res.render("friends",{title:"Friends",auth: req.session.auth,friends:friends})
}

async function check_callback(req,res){
    let status = await checks.check_friend(req);
    if (status === 2){
        res.json([{friend : "notsent"}])
    }
    else{
        if (status === 1 || status === 4){
            res.json([{friend : "accepted"}])
        }
        else {
            res.json([{friend : status}])
        }
    }
}

async function send_callback(req,res){
    let sent = await checks.add_friend(req)
    res.redirect(`../../../users/${req.params.user}`)
}

async function accept_callback(req,res){
    let sent = await checks.accept_friend(req)
    res.redirect(`../../../users/${req.params.user}`)
}

async function remove_callback(req,res){
    let sent = await checks.remove_friend(req)
    res.redirect(`../../../users/${req.params.user}`)
}

/* async function connections_callback(req,res){
    let f1 = await checks.find_friend(req)
    for (i = 0; i < f1.length; i++) {
        if (f1[i])
    }
  } */

module.exports = router
