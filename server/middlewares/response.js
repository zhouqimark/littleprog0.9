const debug = require("debug")("little-prog");
module.exports = async (ctx, next) => {
    try {
        await next();

        ctx.body = ctx.body ? ctx.body : {
            code: ctx.state.code != undefined ? ctx.state.code : 0,
            data: ctx.state.data != undefined ? ctx.state.data : {}
        }
    } catch (e) {
        debug("Catch Error: %o", e);

        ctx.status = 500;

        ctx.body = {
            code: -1,
            error: e &&e.message ? e.message : e.toString()
        }
    }
}