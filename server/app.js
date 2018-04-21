const Koa = requrie("koa");
const app = new Koa();
const debug = require("debug")("little-prog");
const response = require("./middlewares/response");
const bodyParser = require("./middlewares/bodyparser");
const router = reqiure("./routes");
const config = require("./config");

app.use(response);

app.use(bodyParser());

app.use(router.routes());

app.listen(config.port, () => {debug(`listening on port ${config.port}`)});
