var express = require("express");
const session = require("express-session");
const { get_details, get_comments, got_comments } = require("./db");
var router = express.Router();

/* GET users listing. */

router.get("/:id", function (req, res, next) {
  findUser(req.params.id, res, req);
});

async function findUser(id, res, req) {
  let result = await get_details(id);
  if (result[0] === undefined) {
    res.render("error", {title: "Error", auth: req.session.auth,});
    return 0;
  }
  let user = await verify(req, id)
  let written_comments = await get_comments(id);
  let received_comments = await got_comments(id);

  let details = {
    uid: result[0].uid,
    name: result[0].name,
    hostel: result[0].hostel,
    dept: result[0].dept,
    user: await verify(req, id),
  };
  res.render("profile", {
    title: details.name, auth: req.session.auth,
    details: details,
    written_comments: written_comments,
    received_comments: received_comments,
    session: req.session,
    written : await written(user,req,received_comments),
  });
}
module.exports = router;

function verify(req, id) {
  return new Promise((resolve,) => {
    (req.session.auth === id) ? resolve(true) : resolve(false);
  });
}

async function written(user,req,received_comments) {
  var written;
  if ((user === false)) {
    for (let i = 0; i < received_comments.length; i++) {
      if (received_comments[i].writer === req.session.auth) {
        written = received_comments[i];
      }
    }
  }
  return written;
}
