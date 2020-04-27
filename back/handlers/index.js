const addUrl = require('./addUrl');
const getAllUrls = require('./getAllUrls');
const resolve = require('./resolve');

const routes = [
  {method: 'post', path: '/addUrl', handler: addUrl},
  {method: 'post', path: '/getAllUrls', handler: getAllUrls},
  {method: 'get', path: '/:url', handler: resolve}
];


// draft, надо переписывать если планируется добавление middleware специфичных для отдельных роутов
module.exports = function(app, ctx){
  routes.forEach(route => app[route.method](route.path, route.handler(ctx)));
}
