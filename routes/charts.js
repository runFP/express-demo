const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const url = require('url');
const cors = require('cors')
router
    .use(cors())
    .post('/', (req, res, next) => {
        console.log(req.body);
        const {chartType, apiUrl, apiParams} = req.body;
        const newCharts = {chartType, apiUrl, apiParams};
        console.log(newCharts);
        res.json(newCharts);
    });

module.exports = router;