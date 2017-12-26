import { Component } from '@angular/core';
import { BlobService, createTableService, createBlobService, ServiceResponse } from 'azure-storage'
import { environment } from '../../../../Environments/environment'
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'parser',
    templateUrl: './parser.component.html'
})

export class ParserComponent implements OnInit{

    public _blobs: Array<string> = new Array<string>(); 
    ngOnInit() {
        console.log("On Init");
        var x: Array<string> = new Array<string>();
        this.getLogData().then(value => {
            console.log("after promise", value);
            this._blobs = value;
        });
    }

    getLogData(/*callback: (resultData: Array<string>) => void*/) {
        var blobService = createBlobService(environment.AZURE_STORAGE_CONNECTION_STRING);
        var blobOptions: BlobService.ListBlobsSegmentedRequestOptions = { delimiter : 'y=2017/m=12/d=04' };
        return new Promise<Array<string>>( (resolve, reject) => {
            blobService
            .listBlobsSegmentedWithPrefix(
                'insights-logs-applicationgatewayfirewalllog', 
                'resourceId=/SUBSCRIPTIONS/XXXXXXX/RESOURCEGROUPS/DTPORTALSPROD/PROVIDERS/MICROSOFT.NETWORK/APPLICATIONGATEWAYS/XXXXXX/y=2017/m=12/d=04',
                null,
                (error: Error, result: BlobService.ListBlobsResult, response: ServiceResponse) => { 
                    var blobs: Array<string> = new Array<string>();
                    
                    var loopPromise = new Promise<Array<string>>((resolve, reject) =>{
                        result.entries.forEach((entry: BlobService.BlobResult) => {
                            blobs.push(entry.name);
                        });
                        resolve(blobs);
                    });

                    loopPromise.then(value => {
                        console.log("finished loop", value);
                        resolve(blobs); //NOTE: have to return this value again so it can be picked up
                                        //      by caller
                    }, reason => {
                        console.log(reason);
                    } );
                 },
            );
        });
    }
}