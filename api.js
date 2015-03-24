const router = module.exports = require("express").Router();
const config = require("./config");
//const bodyParser = require('body-parser');
//router.use(bodyParser.urlencoded());

const {DB} = require("@bengler/imdi-dataset");
const db = new DB(require("./dataset/tree.json"));


router.get("/query", function (req, res, next) {
  db.query(req.query)
    .then(data => {
      res.json(data);
    })
    .catch(next);
});

router.use(function (err, req, res, next) {
  res.json({
    error: err.message,
    stack: config.env === 'development' && err.stack
  });
});