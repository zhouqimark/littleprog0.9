const { uploader } = requrie("../qcloud");

moduel.exports = async ctx => {
    const data = await uploader(ctx.req)
    ctx.state.data = data;
}