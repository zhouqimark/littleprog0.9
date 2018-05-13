const _ = require('lodash')
const fs = require('fs')
const path = require('path')


const mapDir = d => {
    const tree = {}

    // 获得当前文件夹下的所有的文件夹和文件
    const [dirs, files] = _(fs.readdirSync(d)).partition(p => fs.statSync(path.join(d, p)).isDirectory())

    // 映射文件夹
    dirs.forEach(dir => {
        tree[dir] = mapDir(path.join(d, dir))
    })

    // 映射文件
    files.forEach(file => {
        if (path.extname(file) === '.js') {
            tree[path.basename(file, '.js')] = require(path.join(d, file))
        }
    })

    return tree
}

/* function RestBase(model){
    this.model = model;
    this.res = [];
    this.getAll = async (query={}, fields=[], options={}) => {
        const page = Number(options.page) || 1;
        const limit = Number(options.limit) || 10;
        const offset = (page - 1) * limit;

        model.select(...fields).limit(limit).offset(offset);
    }

    this.get = async () => {
        this.res.concat( await model.select("id", "name"));
    }

    this.post = (body=[]) => {
        model.insert(...body);
    }

    this.put = async (query={}, body={}) => {
        body.update_at = new Date();
        model.where(query).update(body)
    }

    this.del = async (query={}) => {
        model.where(query).del();
    }
} */



module.exports = mapDir(path.join(__dirname));