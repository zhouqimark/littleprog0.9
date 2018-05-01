module.exports = async (ctx, next) => {
    ctx.state.data = {status: 0};
    ctx.state.code = 400;
}