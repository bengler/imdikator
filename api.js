const router = module.exports = require("express").Router();
const config = require("./config");
//const bodyParser = require('body-parser');
//router.use(bodyParser.urlencoded());

const DB = require("@bengler/imdi-dataset").DB;
const db = new DB(require("@bengler/imdi-dataset/data"));

function parseQueryTime(table, queryTime) {
  if (queryTime == 'all') {
    return db.getAllPossibleTimesForTable(table)
  }
  if (queryTime == 'current') {
    return Promise.resolve(['2013']);
  }
  if (!Array.isArray(queryTime)) {
    return Promise.reject(new Error("The parameter 'time' should be all, current or an array of years"))
  }
  return Promise.resolve(queryTime)
}

function prepareQuery(query) {

  const parsedQueryTime = parseQueryTime(query.table, query.time);

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
  })
    .catch(next);
});

router.use(function (err, req, res, next) {
  if (req.accepts('json', 'html') === 'html') return next(err);
  res.status(500).json({
    error: {
      message: err.message,
      stack: config.env === 'development' && err.stack
    }
  });
})
;