const router = module.exports = require("express").Router();
//const bodyParser = require('body-parser');
//router.use(bodyParser.urlencoded());

const {DB} = require("@bengler/imdi-dataset");
const db = new DB(require("./dataset/tree.json"));


router.get("/query", function(req, res) {
  res.json(req.query);
});