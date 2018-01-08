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

    _blobs: Array<BlobEntity> = new Array<BlobEntity>(); 
    _container: string = 'insights-logs-applicationgatewayfirewalllog';
    _loading: boolean = false;

    ngOnInit() { }

    getLogDataEvent(date: string){
        this._loading = true;
        let parsedDate = new Date(date);
        this.getLogData(parsedDate.getFullYear(), parsedDate.getMonth() + 1, parsedDate.getDate())
            .then(value => {
                this._blobs = this.prettifyLogName(value.blob, value.prefix);
                this._loading = false;
            });
    }

    getLogData(year: number, month: number, day: number) {
        let subscriptionId = localStorage.getItem("subscriptionID");
        let resourceGroupName = localStorage.getItem("resourceGroupName");
        let applicationGatewayName = localStorage.getItem("appGatewayName");
        let azureBlobConnString = localStorage.getItem("azureBlobConnString");
        let prefix = 'resourceId=/SUBSCRIPTIONS/{subscriptionId}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/APPLICATIONGATEWAYS/{applicationGatewayName}/y={year}/m={month}/d={day}';
        
        prefix = 
            prefix.replace("{year}", year.toString());
        prefix = 
            prefix.replace("{month}", this.pad(month));
        prefix = 
            prefix.replace("{day}", this.pad(day));
        prefix = 
            prefix.replace("{subscriptionId}", subscriptionId);
        prefix = 
            prefix.replace("{resourceGroupName}", resourceGroupName);
        prefix = 
            prefix.replace("{applicationGatewayName}", applicationGatewayName);
        
        console.log(prefix);
        let blobService = createBlobService(azureBlobConnString);

        return new Promise<any>((resolve, reject) => {
            let blobs: Array<string> = new Array<string>();
            blobService
            .listBlobsSegmentedWithPrefix(
                this._container, 
                prefix,
                null,
                (error: Error, result: BlobService.ListBlobsResult, response: ServiceResponse) => {
                    result.entries.forEach((entry: BlobService.BlobResult) => {
                        blobs.push(entry.name);
                    });
                    let reply = { blob: blobs, prefix: prefix };
                    resolve(reply);
                    // By executing resolve(), the caller will get the evaluated array
                 },
            );
            //console.log("Unevaluated array", blobs); 
            //Chrome shows zero results until the array is opened 
            //(Chrome message: Below value was evaluated just now)
        });
    }

    prettifyLogName(blobs: Array<string>, prefix: string): Array<BlobEntity>{

        var blobEntities: Array<BlobEntity> = new Array<BlobEntity>();
        blobs.forEach((blob: string) =>{
            var entity = new BlobEntity(blob, blob.replace(prefix + "/", ''));
            blobEntities.push(entity);
        });

        return blobEntities;
    }

    pad(n: number): string {
        return (n < 10) ? ("0" + n.toString()) : n.toString();
    }
}