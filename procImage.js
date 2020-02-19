const crypto = require('crypto')
const fs = require('fs')
const os = require('os')
const path = require('path')

const WORKSPACE = path.resolve('./')
const CACHE_DIR = path.join(WORKSPACE, 'cache')
const SAVE_DIR = path.join(WORKSPACE, 'images')

const UUIDGeneratorNode = () =>
    ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, c =>
        (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16)
    );

const saveImage = (src) => {
    const ext = path.extname(src),
        uuid = UUIDGeneratorNode(),
        fileName = `${uuid}${ext}`,
        filePath = path.join(SAVE_DIR, fileName)

    // 解码图片
    console.log('保存图片: ', filePath)
    // 创建读取流
    readable = fs.createReadStream(src);
    // 创建写入流
    writable = fs.createWriteStream(filePath);
    // 通过管道来传输流
    readable.pipe(writable);

    return filePath
}

const getImageFiles = (url) => {
    const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.avg']
    return fs.readdirSync(url).map(item => {
        if (IMAGE_EXT.indexOf(path.extname(item).toLowerCase()) != -1) {
            return path.join(url, item)
        }
    })
}

function deleteFolderRecursive (url) {
    var files = [];
    if (fs.existsSync(url)) {
        files = fs.readdirSync(url);
        files.forEach(function (file, index) {
            var curPath = path.join(url, file);
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(url);
    } else {
        console.log("给定的路径不存在，请给出正确的路径");
    }
}

const clearCache = () => {
    fs.readdirSync(CACHE_DIR).map(item => {
        fs.unlinkSync(path.join(CACHE_DIR, item))
    })
}

const proccessImage = (options) => {
    if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR)
    }
    if (!fs.existsSync(SAVE_DIR)) {
        fs.mkdirSync(SAVE_DIR)
    }
    getImageFiles(CACHE_DIR).map(item => {
        saveImage(item)
    })

    if (!options.saveCache) {
        clearCache()
    }
}

options = {
    saveCache: false
}

proccessImage(options)