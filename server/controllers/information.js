const { mysql } = require("../qcloud");

const constructClause = (info, user, colx, coly) => {
    colx.forEach((val, index, arr) => {
        arr[index] = info + "." + val + " as " + val;
    })

    coly.forEach((val, index, arr) => {
        arr[index] = user + "." + val + " as " + val;
    })

    return colx.concat(coly);
}

const get = async (ctx, next) => {
    const t = ctx.request.query.type;
    const page = Number(ctx.request.query.page);
    const limit = Number(ctx.request.query.limit);

    const offset = (page - 1) * limit;
    const order = ["create_at", "desc"];

    const infoColumn = ["_id", "user_id", "title", "type", "area", "contact", "phone_number", "mail", "content", "attach_img", "watches", "vote_up", "priority", "create_at"];
    const userColumn = ["name", "avatar", "member_ship"];
    const selectClause = constructClause(t, "user", infoColumn, userColumn);

    try {
        const ret = await mysql(t).innerJoin("user", "user._id", t+".user_id").limit(limit).offset(offset).orderBy(...order).select(selectClause);

        ctx.state.code = 200;
        ctx.state.message = "调用成功";
        var hasNext = true;

        if(ret.length <= limit) {
            hasNext = false;
        }

        ctx.state.data = {
            items: ret,
            paginate: {
                page: page,
                limit: limit,
                hasNext: hasNext
            }
        }
    } catch (err) {
        ctx.state.message = err
        console.log(err);
    }
}

const post = async (ctx, next) => {
    const t = ctx.request.query.which;
    const create_at = mysql.fn.now();
    var req_body = ctx.request.body;
    req_body.project_images = JSON.stringify(req_body.project_images);

    const body = {
        user_id: req_body.user_id,
        title: req_body.project_name,
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