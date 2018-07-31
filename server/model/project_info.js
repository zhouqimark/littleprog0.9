const { mysql } = require("../qcloud");

const createTable = () => { mysql.schema.hasTable("project_info").then(exists => {
    if(!exists) {
        return mysql.schema.createTable("project_info", t => {
            t.increments("_id").primary();
            t.integer("user_id").references("user._id");
            t.string("title", 50);
            t.string("type", 50);
            t.string("area", 50);
            t.string("contact", 50);
            t.string("phone_number", 50);
            t.string("mail", 50);
            t.text("content");
            t.specificType("attach_img", "JSON");
            t.bigInteger("watches").defaultTo(0);
            t.bigInteger("vote_up").defaultTo(0);
            t.integer("priority").defaultTo(0);
            t.date("create_at");
        })
    }
})}

const project_info = async (ctx, next) => {
    createTable();
    
    const ex = await mysql.schema.hasTable("project_info");
    if(!ex){
        //const t = mysql.fn.now();
        //await mysql("information").insert();
        ctx.state.analysis = "test"
    }

    await next();
}

module.exports = project_info;