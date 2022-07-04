/**
 * 数据库连接
 */
const mongoose = require('mongoose')
const config = require('./index')

mongoose.connect(config.URL)

const db = mongoose.connection;

db.on('error',()=>{
    console.error('数据库连接失败')
})

db.on('open',()=>{
    console.info('数据库连接成功')
})