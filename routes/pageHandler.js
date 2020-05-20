const express = require('express');
const router = express.Router();

const {resultHandler} = require('../util/util');

const cors = require('cors');
const fs = require('fs');
const path = require('path');
const url = require('url');

/* GET users listing. */
/*router.get('/:id', function (req, res, next) {
    console.log(url.format({
        pathname: path.join(__dirname, `html/${req.params.id}.html`),
        protocol: 'file',
        slashes: true
    }));
    console.log(url.format({
        pathname: path.join(__dirname, `html/${req.params.id}.html`),
        slashes: true
    }));
    console.log(url.format({
        pathname: path.join(__dirname, `../html/${req.params.id}.html`),
    }));
    res.render('index', {title: req.params.id}, (err, html) => {

        fs.writeFile(url.format({
            pathname: path.join(__dirname, `../html/${req.params.id}.html`),
            // pathname: path.join(__dirname, `html/${req.params.id}.html`),
        }), html, err => console.log(err));

        res.send(html);
    });
});*/

const postHandler = (req, res, next) => {
    const {htmlStr, name} = req.body;
    console.log(req.body);
    if (htmlStr && name) {
        res.render('index', {htmlStr, name}, (err, html) => {

            fs.writeFile(url.format({
                pathname: path.join(__dirname, `../html/${name}_${(new Date).getTime().toString(16)}.html`),
            }), html, err => {
                if (err) {
                    res.json(resultHandler(false, '页面创建'));
                } else {
                    res.json(resultHandler(true, {html}, '页面创建'));
                }
            });
        });
    } else {
        res.json(resultHandler(false, 'htmlStr或者name参数不能为空'));
    }
};


router.use(cors())
    .post('/', postHandler);

module.exports = router;
