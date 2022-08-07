var express = require("express");
var router = express.Router();
var checks = require("./db");

var departments = [
  { no: 1, name: "CSE" },
  { no: 2, name: "ECE" },
];
var hostel = [
  { no: 1, name: "Zircon" },
  { no: 1, name: "Opal" },
];

router.get("/", function (req, res, next) {
  res.render("search", {
    title: "Search",
    auth: req.session.auth,
    departments: departments,
    hostel: hostel,
  });
});

router.post("/", function (req, res, next) {
  console.log(req.body.hostel);
  callback(res, req);
});

async function callback(res, req) {
    if (req.body.hostel === undefined){
        req.body.hostel = ''
    }
    if (req.body.department === undefined){
        req.body.department = ''
    }
  let results = await checks.get_both(req);
  res.render("search", {
    title: "Search",
    auth: req.session.auth,
    search: req.body.search,
    results: results,
    departments: departments,
    hostel: hostel,
  });
}
module.exports = router;
