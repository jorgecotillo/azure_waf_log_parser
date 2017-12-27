import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component ({
    selector: 'blob-visualizer',
    templateUrl: './blob.visualizer.component.html'
})

export class BlobVisualizerComponent implements OnInit {

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        // subscribe to router event
        this.activatedRoute.params.subscribe((params: Params) => {
            let originalUrl = params["id"];
            console.log(originalUrl);
        });
    }
}