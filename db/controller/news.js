var NewsModel = require('../model/news.js');

module.exports = {
    model: NewsModel,

    //
    GetTodoList: function() {
        return NewsModel.find({ loaded: {$ne: true}})
            .sort({date: -1})
            .exec(function(err, items){
                if (err) {
                    console.log('error')
                }
                return (items);
            });
    },

    GetFixDataList: function() {
        return NewsModel.find({ loaded: true, content: ''})
            .sort({date: -1})
            .exec(function(err, items){
                if (err) {
                    console.log('error')
                }
                return (items);
            });
    },

    getAll: function() {
        return NewsModel.find({ loaded: {$ne: true}} , '-_id id title from date href')
        //.sort({date: -1})
            .exec(function(err, items){
                if (err) {
                    console.log('error')
                }
                return (items);
            });
    },
    getAllLoaded: function() {
        return NewsModel.find({ loaded: true} , '-_id id title from date loaded')
            .sort({date: -1})
            .exec(function(err, items){
                if (err) {
                    console.log('error')
                }
                return (items);
            });
    },
    get: function(id) {
         return   NewsModel.findOne({id: id})
                .exec(function(err, item) {
                    if (err) {
                        return {};
                    }
                    return (item);
                });
    },
    getListByCat: function(cid) {
        return   NewsModel.find({cat: cid, loaded: true, hasSiblings: {$exists: true}, title: {$exists: true}})
            .sort({date: -1})
            .exec(function(err, items) {
                if (err) {
                    return [];
                }
                return (items);
            });
    },
    getSiblings: function(id) {
        return   NewsModel.find({siblingId: id}, '-_id id title cat from date content siblingNum')
            .exec(function(err, items) {
                if (err) {
                    return [];
                }

                return (items);
            });
    },

    CheckById: function(id) {
        return NewsModel.findOne({id: id})
            .exec(function(err, item) {
                return (!err && item);
            });
    },

    buildContent: function (content){
        var afterList = [];
        if (content) {
            var list = content.split('|');
            if (list && list.length > 0) {
                list.forEach((c) => {
                    if (c.match(/\.(jpeg|jpg|gif|png)$/) != null) {
                        afterList.push({type: 'img', content: c});
                    }
                    else {
                        afterList.push({type: 'p', content: c});
                    }
                })
            }
        }
        return afterList;
    },
    updateItem: (item) => {
        // check if it has been loaded into the db first!
        return new global.Promise(
            (resolve, reject) => {
                NewsModel.count({id: item.id, content: {$exists: true, $ne: ''}})
                    .exec(function(err, count) {
                        if (err) {
                            reject('error');
                        }
                        if (count > 0) {
                            resolve(); // existed data. ignore
                        }
                        else {
                            NewsModel.findOneAndUpdate({id: item.id}, item, {upsert: true, 'new': true})
                                .exec(function(err, _item) {
                                    if (err) {
                                        reject('error');
                                    }
                                    resolve(_item && _item._doc);
                                });
                        }

                    });
            }
        );
    },


    // news/all/:number
    GetAll: function (req, res) {
        var number = 100; // set max return numbers

        if (req.params && req.params.number) {
            number = _.parseInt(req.params.number);
            //console.log(number);
        }

        NewsModel.find({})
            // .sort({date: -1})
            .limit(number)
            .exec(function(err, users){
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!users || users.length < 1) {
                    return Status.returnStatus(res, Status.NULL);
                }

                res.json(users);
            });
    },

    // news/cat/:cat/:number
    // the list not include sibling pages
    GetAllByCat: function (req, res) {
        var number = 85; // set default max return numbers

        if (req.params && req.params.number && req.params.cat) {
            number = _.parseInt(req.params.number);
        }

        NewsModel.find({cat: req.params.cat, loaded: true, hasSiblings: {$exists: true}},
            '-_id id title from date')
            .sort({date: -1})
            .limit(number)
            .exec(function(err, items){
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                // if (!items || items.length < 1) {
                //     return Status.returnStatus(res, Status.NULL);
                // }

                res.json(items);
            });
    },

    // 根据ID获取
    GetById: function (req, res) {

        if (req.params && req.params.id) {

            NewsModel.findOne({id: req.params.id})
                .exec(function(err, item) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!item) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    res.json(item);
                });
        }
    },

    // news/sib/:id
    // 根据page ID 得到他的所有siblings
    GetSiblings: function(req, res) {

        if (req.params && req.params.id) {

            NewsModel.find({siblingId: req.params.id})
                .exec(function(err, items) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }
                    res.json(items);
                });
        }
    },


    GetHot: function(req, res) {

    },
    // get latest top 100
    GetLatest: function(req, res) {
        var number = 85; // set default max return numbers
        if (req.params && req.params.number) {
            number = _.parseInt(req.params.number);
        }

        NewsModel.find({loaded: true, hasSiblings: {$exists: true}},
        '-_id id title from date')
            .sort({date: -1})
            .limit(number)
            .exec(function(err, items){
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!items || items.length < 1) {
                    return Status.returnStatus(res, Status.NULL);
                }

                res.json(items);
            });
    },

    // for test
    DeleteById: function (req, res) {
        if (req.params && req.params.id) { // params.id is ID

            NewsModel.findOne({_id: req.params.id}, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item){
                    return Status.returnStatus(res, Status.NULL);
                }

                //
                item.remove(function(err, raw){
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }
                    res.json(raw);
                });

            });
        }
    },


}