const { mysql } = require("../qcloud");

const createTable = () => { mysql.schema.hasTable("user").then(exists => {
    if(!exists) {
        return mysql.schema.createTable("user", t => {
            t.increments("_id").primary();
            t.string("name", 50);
            t.string("tel", 50);
            t.integer("report_numbers").defaultTo(0);
            t.boolean("block_list").defaultTo(false);
            t.boolean("membership").defaultTo(false);
            t.date("create_at");
            t.date("update_at");
        })
    }
})}

const user = async (ctx, next) => {
    createTable();
    
    const ex = await mysql.schema.hasTable("user");
    if(!ex){
        const t = mysql.fn.now();
        await mysql("user").insert([{name: "小明", tel: "43434", create_at: t}, {name: "小wang", tel: "43434", create_at: t}, {name: "xiaoji", tel: "43434", create_at: t}, {name: "小si", tel: "43434", create_at: t}]);
    }

    await next();
}

module.exports = user;