const router = module.exports = require("express").Router();
const config = require("./config");
//const bodyParser = require('body-parser');
//router.use(bodyParser.urlencoded());

const {DB} = require("@bengler/imdi-dataset");
const db = new DB(require("./dataset/tree.json"));

function parseQueryTime(queryTime) {
  if (queryTime == 'all') {
    return db.getAllPossibleTimes()
  }
  if (queryTime == 'current') {
    return Promise.resolve([new Date().getFullYear()]);
  }
  return Promise.resolve(queryTime)
}

function prepareQuery(query) {

  const parsedQueryTime = parseQueryTime(query.time);

  return parsedQueryTime.then(time => {
    return Object.assign({}, query, {
      time: time
    });
  });
}

router.get("/query", function (req, res, next) {
  prepareQuery(req.query).then(query => {
    db.query(query)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
});

router.use(function (err, req, res, next) {
  res.json({
    error: err.message,
    stack: config.env === 'development' && err.stack
  });
});