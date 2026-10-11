import { APIRequestContext } from "@playwright/test";
import { logger } from "../../utilities/logger";


export class APIHelper {
    private readonly BASE_URL:string;
    private readonly request:APIRequestContext

    constructor(request:APIRequestContext,baseurl:string){
        this.request=request;
        this.BASE_URL=baseurl;
    }

   async  getCall(endPoint:string,headers?:Record<string,string>){
       logger.info(`Sending GET request to ${endPoint}`);
       let response= await this.request.get(`${this.BASE_URL}${endPoint}`,
            {
                headers:headers,
            }
        )
        logger.info(`GET request to ${endPoint} completed with status ${response.status()}`);
        return {
            body: await response.json(),
            status: response.status(),
        }
    }

    
   async  postCall(endPoint:string,data:object,headers?:Record<string,string>){
       logger.info(`Sending POST request to ${endPoint}`);
       let response= await this.request.post(`${this.BASE_URL}${endPoint}`,
            {
                headers:headers,
                data:data,
            }
        )
        logger.info(`POST request to ${endPoint} completed with status ${response.status()}`);
        return {
            body:await response.json(),
            status:response.status(),
        }
    }

     async  putCall(endPoint:string,data:object,headers?:Record<string,string>){
       logger.info(`Sending PUT request to ${endPoint}`);
       let response= await this.request.put(`${this.BASE_URL}${endPoint}`,
            {
                headers:headers,
                data:data,
            }
        )
        logger.info(`PUT request to ${endPoint} completed with status ${response.status()}`);
        return {
            body: await response.json(),
            status:response.status(),
        }
    }
     async  deleteCall(endPoint:string,headers?:Record<string,string>){
       logger.info(`Sending DELETE request to ${endPoint}`);
       let response= await this.request.put(`${this.BASE_URL}${endPoint}`,
            {
                headers:headers,
            }
        )
        logger.info(`DELETE request to ${endPoint} completed with status ${response.status()}`);
        return {
            status:response.status(),
        }
    }
}