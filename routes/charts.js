const express = require('express');
const router = express.Router();

const cors = require('cors');
const {ObjectID, MongoClient} = require('mongodb');
const {DB_URL} = require('../config/inf');

const {resultHandler} = require('../util/util');

const DB_NAME = 'charts';
const COLLECTION_NAME = 'chartInf';


/**
 * 创建报表
 */
const postHandler = (req, res, next) => {
    MongoClient.connect(DB_URL, {useUnifiedTopology: true})
        .then(client => {
            const db = client.db(DB_NAME);
            const chartInf = db.collection(COLLECTION_NAME);
            chartInf.insertOne(req.body).then(result => {
                res.json(resultHandler(true, {id: result.insertedId}, '保存'));
            }).catch(err => {
                console.log(err);
                res.json(resultHandler(false, err));
            }).finally(() => client.close());
        })
};

/**
 * 查询报表
 * @param id [''|string]
 */
const getHandler = (req, res, next) => {
    MongoClient.connect(DB_URL, {useUnifiedTopology: true})
        .then(client => {
                const db = client.db(DB_NAME);
                const chartInf = db.collection(COLLECTION_NAME);
                if (isId(req.query.id)) {
                    try {
                        let query = '';
                        if (Object.keys(req.query).length !== 0) {
                            if (Array.isArray(req.query.id)) {
                                query = {$in: req.query.id.map(id => ObjectID(id))};
                            } else {
                                query = {$in: [ObjectID(req.query.id)]};
                            }
                            query = {_id: query};
                        }
                        chartInf.find(query).toArray().then(result => {
                                res.json(resultHandler(true, result.map(item => {
                                    item.id = item._id;
                                    delete item._id;
                                    return item;
                                }), '返回'));
                            }
                        ).catch(err => res.json(resultHandler(false, err))).finally(() => client.close());
                    } catch (e) {
                        console.log(e.message);
                    }
                } else {
                    res.json(resultHandler(false, 'id格式错误'));
                }
            }
        )
};

/**
 * 删除报表
 * @param id [array]
 */
const deleteHandler = (req, res, next) => {
    MongoClient.connect(DB_URL, {useUnifiedTopology: true})
        .then(client => {
            const db = client.db(DB_NAME);
            const chartInf = db.collection(COLLECTION_NAME);
            if (isId(req.query.id)) {
                try {
                    chartInf.deleteOne({_id: ObjectID(req.query.id)}).then(result => {
                            res.json(resultHandler(true, '删除'));
                        }
                    ).catch(err => res.json(resultHandler(false, err))).finally(() => client.close());
                } catch (e) {
                    console.log(e);
                }
            } else {
                res.json(resultHandler(false, 'id格式错误'));
                client.close();
            }
        })
};

/**
 * 更新报表
 * @param id [string]
 */
const updateHandler = (req, res, next) => {
    MongoClient.connect(DB_URL, {useUnifiedTopology: true})
        .then(client => {
            const db = client.db(DB_NAME);
            const chartInf = db.collection(COLLECTION_NAME);
            const id = req.body.id;
            if (isId(id)) {
                const {id, ...updateFields} = req.body;
                try {
                    chartInf.updateOne(
                        {_id: ObjectID(id)},
                        {
                            $set: {...updateFields}
                        }).then(result => {
                            res.json(resultHandler(true, '更新'));
                        }
                    ).catch(err => res.json(resultHandler(false, err))).finally(() => client.close());
                } catch (e) {
                    console.log(e);
                }
            } else {
                res.json(resultHandler(false, 'id格式错误'));
                client.close();
            }
        })
};


router.use(cors())
    .post('/', postHandler)
    .get('/', getHandler)
    .put('/', updateHandler)
    .delete('/', deleteHandler);


/**
 * 空值和符合格式的id均返回true
 * @param id
 * @return {boolean}
 */
function isId(id) {
    console.log(id);
    if ((id && (id.length === 12 || id.length === 24)) || id === undefined || Array.isArray(id)) {
        return true;
    }
    return false;
}

module.exports = router;