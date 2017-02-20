# Express Restful

express-restful.ts is a node.js express library which handles HTTP requests and makes much easier creating Restful APIs. 
It uses @Rest('/path') annotation put on TypeScript class, which indicates that annotated class is Express router.


## Installation

```sh
$ npm install --save express-restful.ts
```

## Getting Started

#### Configuration

```typescript
import * as express from 'express';
import restful from 'express-restful.ts';

const server = express();

restful.configure(server,{
    dirname:__dirname+'/resources'
});
server.listen(8080);

```

`dirname` - Routers' Directory

folder structure example

```
-------node_modules
	|--server.js
	|--resources
		|--resource-a.js
		|--resource-b.js
		|--sub-folder
			|--resource-c.js
			|--resource-d.js
			...
```

#### Define Resource

###### Simple examples

```typescript
import {Rest} from 'express-restful.ts';

@Rest('/')
class SimpleResource {

    get(){
        return { msg: 'hello '}
    }
}
```


With parameters

```typescript
import {Rest} from 'express-restful.ts';

@Rest('/test/:name')
class SimpleResource {

    get(name){
        return { msg: `hello${name}`}
    }
}
```


express-restful.ts package supports following HTTP Methods: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `HEAD`

```typescript
import {Rest} from 'express-restful.ts';

@Rest('/test')
class SimpleResource {
    private query:any;
    private body:any;
    get(){
        console.log(this.query)
        return { msg: {
                 query : this.query
           }
        }
    }
    
    post(){
        console.info(this.body);
        return { msg: {
                body : this.body
            }
        }
    }
    put(){
            console.info(this.body);
            return { msg: {
                    body : this.body
                }
            }
    }
    delete(){}
    patch(){}
    head(){}
}
```


express-restful.ts package also has a use() method which works like in express

```typescript
import {Rest} from 'express-restful.ts';

@Rest('/api')
class ApiResource {
    private next:Function;
    use(){
        //authorize
        console.info("authorize");
        this.next();
    }

}


@Rest('/api/test')
class TestApiResource {
    get(){
        return {
            success:true
        }
    }
}
```


express-restful.ts has @middleware annotation which adds express middleware on route methods

```typescript
import { Rest,middleware } from 'express-restful.ts';

@Rest('/api/test')
class TestApiResource {
        @middleware((req,res,next)=>{ /**...**/ next()})
        get(){
            return {
                success:true
            }
        }
}
```


in express-restful.ts express' send() and render() functions can be used like this:

```typescript
import {Rest} from 'express-restful.ts';
import {Response} from 'express';

@Rest('/api/send')
class TestApiResourceSend {
        private response:Response;
        get(){
            return this.response.send("<div>hello</div>")
        }
}
@Rest('/api/send')
class TestApiResourceRender {
        private response:Response;
        get(){
            return this.response.render("index")
        }
}
```


In express-restful.ts can be Promises for handling responses like this:

```typescript
import {Rest} from 'express-restful.ts';

@Rest('/')
class HomeResource {
    async(){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve("hello");
            },1000)
        })
    }

    get(){
        return this.async();
    }
}
```

All sample code can be found in directory 'test'.
