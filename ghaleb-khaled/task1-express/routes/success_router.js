var news = require('../Logic/news.js');
exports.index = function(req, res){
    news.bringData(res);
};