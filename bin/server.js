const app = require("../app");
const pkg = require("../package");

const server = app.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log("%s listening at http://%s:%s", pkg.name, host, port); // eslint-disable-line no-console
});
