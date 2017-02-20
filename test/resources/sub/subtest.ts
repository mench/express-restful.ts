import {Rest} from '../../../src';
import {Response} from 'express';

@Rest('/sub/test')
class HomeResource  {
    private response:Response;
    get(){
        return this.response.send("hello");
    }
}