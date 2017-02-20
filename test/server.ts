import * as express from 'express';

const logger = require('morgan');

import restful from '../src/';

let server = express();
server.use(logger('dev'));
restful.configure(server,{
    dirname:__dirname+'/resources'
});

server.listen(8080);
