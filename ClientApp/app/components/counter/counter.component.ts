import { Component } from '@angular/core';
import { BlobService, createTableService, createBlobService, ServiceResponse } from 'azure-storage'
import { environment } from '../../../../Environments/environment'

@Component({
    selector: 'counter',
    templateUrl: './counter.component.html'
})
export class CounterComponent {
    public currentCount = 0;

    public incrementCounter() {
        this.currentCount++;
    }
}
