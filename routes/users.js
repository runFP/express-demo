var express = require('express');
var router = express.Router();

const fs = require('fs');
const path = require('path');
const url = require('url');

/* GET users listing. */
router.get('/:id', function (req, res, next) {
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
});

module.exports = router;
