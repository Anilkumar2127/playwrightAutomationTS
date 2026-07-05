import { APIRequestContext } from "@playwright/test";


export class APIHelper {
    private readonly BASE_URL:string;
    private readonly request:APIRequestContext

    constructor(request:APIRequestContext,baseurl:string){
        this.request=request;
        this.BASE_URL=baseurl;
    }

   async  getCall(endPoint:string,headers?:Record<string,string>){
       let response= await this.request.get(`${this.BASE_URL}${endPoint}`,
            {
                headers:headers,
            }
        )
        return {
            body: await response.json(),
            status: response.status(),
        }
    }

    
   async  postCall(endPoint:string,data:object,headers?:Record<string,string>){
       let response= await this.request.post(`${this.BASE_URL}${endPoint}`,
            {
                headers:headers,
                data:data,
            }
        )
        return {
            body:await response.json(),
            status:response.status(),
        }
    }

     async  putCall(endPoint:string,data:object,headers?:Record<string,string>){
       let response= await this.request.put(`${this.BASE_URL}${endPoint}`,
            {
                headers:headers,
                data:data,
            }
        )
        return {
            body: await response.json(),
            status:response.status(),
        }
    }
     async  deleteCall(endPoint:string,headers?:Record<string,string>){
       let response= await this.request.put(`${this.BASE_URL}${endPoint}`,
            {
                headers:headers,
            }
        )
        return {
            status:response.status(),
        }
    }
}