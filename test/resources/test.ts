import {Rest,middleware} from '../../src';
import {Response} from 'express';

@Rest('/')
class HomeResource {
    private response:Response;
    async(){
        return new Promise(function(resolve,reject){
            setTimeout(()=>{
                resolve("hello");
            })
        })
    }

    get(){
        return this.async();
    }
}

@Rest('/v1')
class ApiResource {
    private next:Function;
    use(){
        //authorize
        console.info("authorize");
        this.next();
    }

}


@Rest('/v1/test')
class TestApiResource {
    private response:Response;

    post(){

    }

    @middleware((req,res,next)=>{
        console.info("middle2")
        next()
    })
    @middleware(function(req,res,next){
        console.info("middle1");
        next();
    })
    get(){
        return this.response.send("<div>hello</div>")
    }

}