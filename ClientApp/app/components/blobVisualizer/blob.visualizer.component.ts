import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { BlobService, createTableService, createBlobService, ServiceResponse } from 'azure-storage'
import { environment } from '../../../../Environments/environment';

@Component ({
    selector: 'blob-visualizer',
    templateUrl: './blob.visualizer.component.html'
})

export class BlobVisualizerComponent implements OnInit {

    _container: string = 'insights-logs-applicationgatewayfirewalllog';
    _originalUrl: string;
    public _blobOjects: Array<object>;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this._originalUrl = params["id"];
            this.getBlobText(this._originalUrl).then(value => {
                this.generateBlobObject(value);
                console.log(this._blobOjects);
            });
        });
    }

    getBlobText(fileName: string){
        var blobService = createBlobService(environment.AZURE_STORAGE_CONNECTION_STRING);
        return new Promise<string>((resolve, reject) => {
            blobService
                .getBlobToText(
                    this._container,
                    fileName,
                    (error: Error, blob: string, result: BlobService.BlobResult, response: ServiceResponse) => {
                        if(!error){
                            resolve(blob);
                        }
                        else{
                            console.log("There was an error", error);
                        }
                    }
                );
        });
    }

    generateBlobObject(blob: string) {
        let blobObject = JSON.parse(blob);
        this._blobOjects = Array.of(blobObject.records); 
        //NOTE: Array.of is used to cast the object into an Array
        //      Additionally note that .records returns an array of one, inside you'll find all the inner objects.
        //      If you do .records[0], _blobObjects will only have the first element, recommendation is to leave
        //      .records and loop twice in the UI.
    }
}