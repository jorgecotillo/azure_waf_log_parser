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
        this.getLogData().then(value => {
            //console.log("after promise", value); 
            // Getting evaluated array because it came from resolve()
            this._blobs = value;
        });
    }

    getLogData() {
        var blobService = createBlobService(environment.AZURE_STORAGE_CONNECTION_STRING);
        var blobOptions: BlobService.ListBlobsSegmentedRequestOptions = { delimiter : 'y=2017/m=12/d=04' };
        return new Promise<Array<string>>( (resolve, reject) => {
            var blobs: Array<string> = new Array<string>();
            blobService
            .listBlobsSegmentedWithPrefix(
                'insights-logs-applicationgatewayfirewalllog', 
                'resourceId=/SUBSCRIPTIONS/XXXXX/RESOURCEGROUPS/DTPORTALSPROD/PROVIDERS/MICROSOFT.NETWORK/APPLICATIONGATEWAYS/XXXX/y=2017/m=12/d=04',
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
            //(Chorme message: Below value was evaluated just now)
        });
    }
}