const express = require('express');
const router = express.Router();

const {resultHandler} = require('../util/util');

const cors = require('cors');
const fs = require('fs');
const path = require('path');
const url = require('url');

const postHandler = (req, res, next) => {
    const {htmlStr, name, token} = req.body;
    console.log(req.body);
    if (htmlStr && name) {
        res.render('index', {htmlStr, name, token}, (err, html) => {
            if(err){
                res.json(resultHandler(false, '页面创建'));
            }else{
                res.json(resultHandler(true, {html}, '页面创建'));
            }
            // fs.writeFile(url.format({
            //     pathname: path.join(__dirname, `../html/${name}_${(new Date).getTime().toString(16)}.html`),
            // }), html, err => {
            //     if (err) {
            //         res.json(resultHandler(false, '页面创建'));
            //     } else {
            //         res.json(resultHandler(true, {html}, '页面创建'));
            //     }
            // });
        });
    } else {
        res.json(resultHandler(false, 'htmlStr或者name参数不能为空'));
    }
};


router.use(cors())
    .post('/', postHandler);

module.exports = router;
