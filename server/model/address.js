const { mysql } = require("../qcloud");

const createTable = () => { mysql.schema.hasTable("address").then(exists => {
    if(!exists) {
        return mysql.schema.createTable("address", t => {
            t.increments("_id").primary();
            t.string("name", 50);
            t.string("gender", 50);
            t.string("address", 50);
            t.string("tel", 20).unique();
            t.boolean("is_def").defaultTo(false);
            t.integer("user_id").references("user._id");
            t.date("create_at");
            t.date("update_at");
        })
    }
})}

const address = async (ctx, next) => {
    createTable();
    const ex = await mysql.schema.hasTable("address");
    if(!ex) {
        const t = mysql.fn.now();
        await mysql("address").insert([{name: "小子", gender: "nama", address: "jisdjf", tel: "4324", user_id: 3, create_at: t}, {name: "小子", gender: "nama", address: "jisdjf", tel: "43245345", user_id: 3, create_at: t}, {name: "小子", gender: "nama", address: "jisdjf", tel: "43242524", user_id: 3, create_at: t}]);
    }
    await next();
}

module.exports = address;