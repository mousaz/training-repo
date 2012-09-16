var news = require('../Logic/NewsJSON.js');
exports.index = function(req, res){
    news.bringData(res);
};