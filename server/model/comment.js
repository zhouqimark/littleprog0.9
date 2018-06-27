const { mysql } = require("../qcloud");

const createTable = () => { mysql.schema.hasTable("comment").then(exists => {
    if(!exists) {
        return mysql.schema.createTable("comment", t => {
            t.integer("_id").primary();
            t.integer("info_id").references("informatiion._id");
            t.integer("user_id").references("user._id").primary();
            t.text("content");
            t.date("create_at");
        })
    }
})}

const comment = async (ctx, next) => {
    createTable();
    
    const ex = await mysql.schema.hasTable("comment");
    if(!ex){
        //const t = mysql.fn.now();
        //await mysql("information").insert();
    }

    await next();
}

module.exports = comment;