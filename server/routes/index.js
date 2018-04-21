const router = require("koa-router")({
    prefix: "/weapp"
});

const controllers = require("../controllers");

const {auth: {authorizatiionMiddleware, validationMidlleware}} = require("../qcloud");

router.get("/login", authorizatiionMiddleware, controllers.login);

router.get("/user", validationMidlleware, constroller.user);

router.post("/upload", controllers.upload);

module.exports = router;