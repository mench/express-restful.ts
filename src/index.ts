import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import {
    Rest,
    middleware,
    routers
} from './rest';

const requireAll = require('require-all');

export class Restful {
    configure(app,options:{dirname:String}){
        app.use(cookieParser());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        requireAll({
            dirname     :  options.dirname,
            filter      :  /(.*)\.js$/,
            excludeDirs :  /^\.(git|svn)$/,
            recursive   : true
        });
        routers.forEach(router=>{app.use(router)});
    }
}

export {Rest};
export {middleware};
export default new Restful();