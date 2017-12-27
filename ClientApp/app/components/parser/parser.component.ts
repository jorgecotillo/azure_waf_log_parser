import { Component } from '@angular/core';
import { BlobService, createTableService, createBlobService, ServiceResponse } from 'azure-storage'
import { environment } from '../../../../Environments/environment';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { BlobEntity } from '../shared/entities/blobEntity';

@Component({
    selector: 'parser',
    templateUrl: './parser.component.html'
})

export class ParserComponent implements OnInit{

    public _blobs: Array<BlobEntity> = new Array<BlobEntity>(); 
    _prefix: string = 'resourceId=/SUBSCRIPTIONS/xxxx/RESOURCEGROUPS/DTPORTALSPROD/PROVIDERS/MICROSOFT.NETWORK/APPLICATIONGATEWAYS/xxxxx/y=2017/m=12/d=04';
    _container: string = 'insights-logs-applicationgatewayfirewalllog';

    ngOnInit() {
        this.getLogData()
        .then(value => {
            this._blobs = this.prettifyLogName(value);
        });
    }

    getLogData() {
        var blobService = createBlobService(environment.AZURE_STORAGE_CONNECTION_STRING);
        var blobOptions: BlobService.ListBlobsSegmentedRequestOptions = { delimiter : 'y=2017/m=12/d=04' };
        return new Promise<Array<string>>((resolve, reject) => {
            var blobs: Array<string> = new Array<string>();
            blobService
            .listBlobsSegmentedWithPrefix(
                this._container, 
                this._prefix,
                null,
                (error: Error, result: BlobService.ListBlobsResult, response: ServiceResponse) => {
                    result.entries.forEach((entry: BlobService.BlobResult) => {
                        blobs.push(entry.name);
                    });
                    resolve(blobs); 
                    // By executing resolve(), the caller will get the evaluated array
                 },
            );
            //console.log("Unevaluated array", blobs); 
            //Chrome shows zero results until the array is opened 
            //(Chrome message: Below value was evaluated just now)
        });
    }

    prettifyLogName(blobs: Array<string>): Array<BlobEntity>{

        var blobEntities: Array<BlobEntity> = new Array<BlobEntity>();
        blobs.forEach((blob: string) =>{
            var entity = new BlobEntity(blob, blob.replace(this._prefix + "/", ''));
            blobEntities.push(entity);
        });

        return blobEntities;
    }

    public gotoBlobVisualizerPage(){

    }

    public getBlobText(fileName: string){
        var blobService = createBlobService(environment.AZURE_STORAGE_CONNECTION_STRING);
        blobService
            .getBlobToText(
                this._container,
                fileName,
                (error: Error, blob: string, result: BlobService.BlobResult, response: ServiceResponse) => {
                    if(!error){
                        console.log(blob);
                        console.log("There was no error");
                    }
                    else{
                        console.log("There was an error", error);
                    }
                }
            );
    }
}