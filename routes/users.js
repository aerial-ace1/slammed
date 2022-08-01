var express = require("express");
const session = require("express-session");
const { get_details, get_comments, got_comments } = require("./db");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send(req.session.auth);
});

router.get("/:id", function (req, res, next) {
  findUser(req.params.id, res, req);
});

async function findUser(id, res, req) {
  let result = await get_details(id);
  if (result === undefined){
    res.redirect('error')
  }
  let written_comments = await get_comments(id);
  let received_comments = await got_comments(id);
  var user = await verify(req,id); 
  console.log("akhdjewd",user)
  //var user;
  
  let details = {uid:result[0].uid, name:result[0].name, 
	hostel:result[0].hostel, dept:result[0].dept, user: await verify(req,id), written: await written(user)};
  console.log("akhdjewd",details.user)
  res.render("profile", {
    details: details,
    written_comments: written_comments,
    received_comments : received_comments,
    session: req.session,
    //user : user,
    //written : written,
  });
}
module.exports = router;

async function verify(req,id){
  return ((req.session.auth) == (id)) ? true : false;
}


async function written(user){
	console.log(user)
	var written;
	if (user = false){
		console.log("b");
		for (let i = 0; i < received_comments.length; i++){
		if (received_comments[i].writer === req.session.auth){
			written = received_comments[i]
		}
		}
	}
	return written;
}