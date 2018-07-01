const { mysql } = require("../qcloud");

const get = async (ctx, next) => {

}

const post = async (ctx, next) => {
    const t = ctx.request.query.which;
    const create_at = mysql.fn.now();
    var req_body = ctx.request.body;
    req_body.project_images = JSON.stringify(req_body.project_images);

    const body = {
        user_id: req_body.user_id,
        name: req_body.project_name,
        type: req_body.project_type,
        area: req_body.project_area,
        contact: req_body.project_contact,
        mail: req_body.project_mail,
        phone_number: req_body.project_phone,
        content: req_body.project_intro,
        attach_img: req_body.project_images,
    }

    Object.assign(body, { create_at: create_at });

    try {
        const ret = await mysql(t).returning("_id").insert(body);
        ctx.state.code = 200;
        ctx.state.message = "信息发布成功";
        ctx.state.data = {
            _id: ret[0],
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    get,
    post,
}