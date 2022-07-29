var express = require('express');
const { get_details } = require('./db');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  console.log(res.body.profile);
});

router.get('/:id', function(req, res, next) {
  findUser(req.params.id,res);
})

async function findUser(id,res){
  let result = await get_details(id)
  let details = [result[0].name, result[0].hostel,result[0].dept];
  res.render('profile', { name: details[0], hostel: details[1], dept: details[2] });
}
module.exports = router;
