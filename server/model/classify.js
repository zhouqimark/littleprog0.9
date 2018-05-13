const { mysql } = require("../qcloud");

const createTable = () => { mysql.schema.hasTable("classify").then(exists => {
    if(!exists) {
        return mysql.schema.createTable("classify", t => {
            t.increments("_id").primary();
            t.string("name", 50);
            t.string("remark", 50).nullable();
            t.date("create_at");
            t.date("update_at");
        })
    }
})}

const classify = async (ctx, next) => {
    createTable();
    const t = mysql.fn.now();
    await mysql("classify").insert([{name: "建筑工具", create_at: t}, {name: "建筑劳模", create_at: t}, {name: "建筑设备", create_at: t}, {name: "建筑材料", create_at: t}]);
    await next();
}

module.exports = classify;