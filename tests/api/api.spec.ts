import {test} from '../../src/fixtures/apifixture';

const TOKEN=process.env.TOKEN;
let AUTH_HEADER={Authorization :`Bearer ${TOKEN}`}
let userId:number;
test.describe.serial('validate the go rest apis @apiCalls',async()=>{


test('Validate GET CALL -all users @getCall',async({apihelper})=>{
    let res=await apihelper.getCall('public/v2/users',AUTH_HEADER) 
    console.log(res.body);
    console.log(res.status);
});

test('Validate POST CALL -CREATE USER @postCall',async({apihelper})=>{
    const userdata ={
        name :"skyfall",
        email: `test@${Date.now()}.com`,
        gender:"male",
        status:"active",
    }
    let res=await apihelper.postCall('public/v2/users',userdata,AUTH_HEADER) 
    userId =res.body.id;
    console.log('postcall create user-'+res.status);
});

test('Validate GET CALL -single users @getCall',async({apihelper})=>{
    let res=await apihelper.getCall(`public/v2/users/${userId}`,AUTH_HEADER) 
    console.log(await res.body);
    console.log('getCall test single user'+res.status);
});

test('Valdiate PUT CALLL - for the generated user @putCall',async({apihelper})=>{
    let updateuser={
        name:'jordon'
    }
      let res=await apihelper.putCall(`public/v2/users/${userId}`,updateuser,AUTH_HEADER) 
      console.log(res.body.name);
})

});