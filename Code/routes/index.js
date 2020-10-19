const express = require('express');
const router  = express.Router();
/* GET home page */
router.get('/', (req, res, next) => {
  let loggedInUser = req.session.loggedInUser
  res.render('index', {loggedInUser});
});



module.exports = router;
