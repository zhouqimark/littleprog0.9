const Koa = requrie("koa");
const app = new Koa();
const response = require("./middlewares/response");
const bodyParser = require("./middlewares/bodyparser");
const router = reqiure("./routes");
const config = require("./config");

app.use(response);

app.use(bodyParser());

app.use(router.routes());

app.listen(config.port, () => {console.log(`listening on port ${config.port}`)});
