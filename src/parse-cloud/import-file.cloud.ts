import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ParseCloudAfterSave, ParseCloudBeforeSave, ParseCloudJob } from 'nest-parse-server';
const debug = require('debug')('nest-data-server:cloud');
const reader = require('xlsx')

const ImportFile = 'ImportFile';

@Injectable()
export class ImportFileCloud implements OnApplicationBootstrap {

    onApplicationBootstrap() {
        this.updateSchemaImportFile()
    }

    async updateSchemaImportFile() {
        let mySchema = new Parse.Schema(ImportFile);
        let needCreate = await mySchema.get().then(() => false).catch(err => {
            if (err.code === Parse.Error.INVALID_CLASS_NAME) {
                return true
            }
            debug(err)
            return true
        });
        if (needCreate) {
            mySchema.addString('status')
                .addFile('file')
                .addString('type');
            await mySchema.save();
        }
        
    }

    /**
     * 判断是否要处理
     */
    @ParseCloudBeforeSave(ImportFile)
    async beforeSaveImportFile(request: Parse.Cloud.BeforeSaveRequest<Parse.Object<Parse.Attributes>>) {
        let status = request.object.get('status');
        let file = request.object.get('file');
        if (!status && file) {
            Reflect.set(request.context, 'canImport', true);
            request.object.set('status', 'done')
        }
    }

    /**
     * 执行导入文件处理
     */
    @ParseCloudAfterSave(ImportFile)
    async afterSaveImportFile(request: Parse.Cloud.AfterSaveRequest<Parse.Cloud.Params>) {
        // let message = request.object.get('message');
        // if (message) {
        //     // already done
        //     return;
        // }
        if (!Reflect.has(request.context, 'canImport')) {
            return;
        }
        let type = request.object.get('type');
        let file = request.object.get('file');
        if (!file) {
            return;
        }
        let fileBuffer = await Parse.Cloud.httpRequest({ url: file.url() }).then(function(response) {
            // The file contents are in response.buffer.
            return response.buffer;
        });
    
        // 导入
        if (type === 'ChinaRegion') {
            let xls = reader.read(fileBuffer);
            let items = []
            
            const sheets = xls.SheetNames
            for(let i = 0; i < sheets.length; i++)
            {
                const temp = reader.utils.sheet_to_json(xls.Sheets[xls.SheetNames[i]]);
                temp.forEach(element => {
                    items.push(element);
                });
                
            }
            let itemObjects = items.map(x => new Parse.Object(type, x));
    
            Parse.Object.saveAll(itemObjects)
            request.log.info('从文件' + file.url() + ', 导入 ChinaRegion 数据共 ' + items.length)
        }
    }
}
