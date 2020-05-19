const express = require('express');
const router = express.Router();

const cors = require('cors');
const {ObjectID, MongoClient} = require('mongodb');
const {DB_URL} = require('../config/inf');

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
                res.json(handler(true, {id: result.insertedId}, '保存'));
            }).catch(err => {
                console.log(err);
                res.json(handler(false, err));
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
            chartInf.find(isId(req.query.id) ? ObjectID(req.query.id) : '').toArray().then(result => {
                    res.json(handler(true, result.map(item => {
                        item.id = item._id;
                        delete item._id;
                        return item;
                    }), '返回'));
                }
            ).catch(err => res.json(handler(false, err))).finally(() => client.close());
        })
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
                chartInf.deleteOne({_id: ObjectID(req.query.id)}).then(result => {
                        res.json(handler(true, '删除'));
                    }
                ).catch(err => res.json(handler(false, err))).finally(() => client.close());
            } else {
                res.json(handler(false, '删除'));
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
            console.log(id);
            if (isId(id)) {
                const {id, ...updateFields} = req.body;
                chartInf.updateOne(
                    {_id: ObjectID(id)},
                    {
                        $set: {...updateFields}
                    }).then(result => {
                        res.json(handler(true, '更新'));
                    }
                ).catch(err => res.json(handler(false, err))).finally(() => client.close());
            } else {
                res.json(handler(false, '更新'));
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
 * 返回响应格式
 * @param success
 * @param data
 * @param message
 * @return {{success: boolean, data: null, message: string}}
 */
function handler(success, data, message) {
    if (arguments.length === 12) {
        message = data;
    }
    return {
        success: success ? true : false,
        data: success ? data : null,
        message: success ? `${message}成功` : `失败:${message}`
    };
}

function isId(id) {
    if (id && (id.length === 12 || id.length === 24)) {
        return true;
    }
    return false;
}

module.exports = router;