import {test} from '../../src/fixtures/apifixture';
import { logger } from '../../src/utilities/logger';

const TOKEN=process.env.TOKEN;
let AUTH_HEADER={Authorization :`Bearer ${TOKEN}`}
let userId:number;
test.describe.serial('validate the go rest apis @apiCalls',async()=>{


test('Validate GET CALL -all users @getCall',async({apihelper})=>{
    logger.info('Sending GET request to retrieve all users');
    let res=await apihelper.getCall('public/v2/users',AUTH_HEADER) 
    logger.info(`GET all users completed with status ${res.status}`);
});

test('Validate POST CALL -CREATE USER @postCall',async({apihelper})=>{
    logger.info('Preparing a new user payload');
    const userdata ={
        name :"skyfall",
        email: `test@${Date.now()}.com`,
        gender:"male",
        status:"active",
    }
    logger.info('Sending POST request to create a user');
    let res=await apihelper.postCall('public/v2/users',userdata,AUTH_HEADER) 
    userId =res.body.id;
    logger.info(`POST create user completed with status ${res.status}`);
    logger.info(`Created user id ${userId}`);
});

test('Validate GET CALL -single users @getCall',async({apihelper})=>{
    logger.info(`Sending GET request for user id ${userId}`);
    let res=await apihelper.getCall(`public/v2/users/${userId}`,AUTH_HEADER) 
    logger.info(`GET single user completed with status ${res.status}`);
});

test('Valdiate PUT CALLL - for the generated user @putCall',async({apihelper})=>{
    logger.info(`Preparing an update for user id ${userId}`);
    let updateuser={
        name:'jordon'
    }
      logger.info(`Sending PUT request to update user id ${userId}`);
      let res=await apihelper.putCall(`public/v2/users/${userId}`,updateuser,AUTH_HEADER)
      logger.info(`PUT update user completed with status ${res.status}`);
})

});