import { Module } from '@nestjs/common';
import { ImportFileCloud } from './import-file.cloud';
import { ParseCloudService } from './parse-cloud.service';

@Module({
  providers: [ParseCloudService, ImportFileCloud]
})
export class ParseCloudModule {
}
