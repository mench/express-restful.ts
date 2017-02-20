import * as http from 'http';

import {
    Router,
    Response,
    Request
} from 'express';


const methods = [
    'get',
    'post',
    'put',
    'patch',
    'delete',
    'head',
    'use'
];

export const routers = [];

const MIDDLEWARE:symbol = Symbol('MIDDLEWARE');

class Handler {
    public resource:any;
    constructor(Class){
        this.resource = new Class();
    }

    handle(req:Request,res:Response,next:Function,action:string){
        Object.defineProperties(this.resource,{
            headers     : {value:req.headers,configurable: true},
            query       : {value:req.query,configurable: true},
            params      : {value:req.params,configurable: true},
            path        : {value:req.path,configurable: true},
            body        : {value:req.body,configurable: true},
            response    : {value:res,configurable: true},
            request     : {value:req,configurable: true},
            next        : {value:next,configurable: true}
        });
        let args = Object.keys(this.resource.params).map(k=>this.resource.params[k]);
        args.push(req);
        args.push(res);
        args.push(next);
        let resource = this.resource;
        let promise = new Promise((resolve,reject)=>{
            try{
                resolve(resource[action].apply(resource,args));
            }catch(e){
                reject(e);
            }

        });
        promise.then(result=>{
            let r:any = result;
            let h:any = http;
            if(result instanceof h.ServerResponse){
                return;
            }
            if(result instanceof Error){
                res.status(r.code || 500).json(result);
            }else
            if(typeof result != 'undefined' && result != null){
                res.json(result);
            }else
            if(result == null && typeof result == 'object'){
                res.status(404).json({
                    code:404,
                    message:'resource not found'
                });
            }
        }).catch(err=>{
            console.error(err);
            let e:any = err;
            try {
                if(err instanceof Error){
                    return res.status(e.code || 500).json({
                        error       : e.message,
                        errors      : e.errors,
                        code        : e.code || 500,
                        stack       : e.stack.split("\n")
                    });
                }
                res.status(500).send(err);
            }catch (e){
                console.error(e);
                res.status(500).send(e);
            }
        })

    }

    getClass(){
        return this.resource.constructor;
    }

}

export function middleware(method){
    if(!method || !(method instanceof Function))  {
        throw new Error('middleware must be Function');
    }
    return (self,key,descriptor)=>{
        if(typeof self.constructor != 'function'){
            throw new Error('middleware must defined on method not on class');
        }
        if(!self.constructor[MIDDLEWARE]){
            self.constructor[MIDDLEWARE] = [];
        }
        self.constructor[MIDDLEWARE].push(method);
    }
}

export function Rest(url:string){
    return (Class:any,key?:string)=>{
        if(typeof Class != 'function'){
            throw new Error('must be class not a prop..')
        }
        let router   = Router();
        let handler  = new Handler(Class);
        methods.forEach((action)=>{
            if( handler.resource[action] instanceof Function ){
                let filters = handler.getClass()[MIDDLEWARE] || [];
                router[action](url,filters,(req,res,next)=>{
                    handler.handle(req,res,next,action);
                });
            }
        });
        routers.push(router);
    }
}
