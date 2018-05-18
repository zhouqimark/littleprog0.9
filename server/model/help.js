const { mysql } = require("../qcloud");


const createTable = () => {
    mysql.schema.hasTable("help").then(exists => {
        if(!exists) {
            return mysql.schema.createTable("help", t => {
                t.increments("_id").primary;
                t.string("title", 50);
                t.string("content", 190);
                t.date("create_at");
                t.date("update_at");
            })
        }
    })
}


const help = async (ctx, next) => {
    createTable();

    const ex = await mysql.schema.hasTable("help");
    if(ex) {
        const t = mysql.fn.now();
        await mysql("help").insert([{title: "hi", content: "fafewfasfwefsadfwefsadf", create_at: t}, {title: "you", content: "fashdhfphwefhdfh", create_at: t}]);
    }

    await next();
}

module.exports = help;