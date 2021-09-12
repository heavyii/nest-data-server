import { Injectable, OnModuleInit } from '@nestjs/common';
import { ParseCloudJob } from 'nest-parse-server';

@Injectable()
export class ParseCloudService implements OnModuleInit {

    onModuleInit() {
        Parse.Cloud.job("myJob", (request) =>  {
            ​// params: passed in the job call
            ​// message: a function to update the status message of the job object
            ​const { params, message } = request;
            ​message("I just started");
        });
    }

    @ParseCloudJob('myJob2')
    testAjob(request: Parse.Cloud.JobRequest<Parse.Cloud.Params>) {
        ​// params: passed in the job call
        ​// message: a function to update the status message of the job object
        ​const { params, message } = request;
        ​message("I just started");
    }
}
