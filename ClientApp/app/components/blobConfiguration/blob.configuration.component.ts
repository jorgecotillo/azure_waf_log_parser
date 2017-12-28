import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";

@Component({
    selector: 'blob-configuration',
    templateUrl: './blob.configuration.component.html'
})

export class BlobConfigurationComponent implements OnInit {
    _configuration_form: FormGroup;

    constructor (private formBuilder: FormBuilder){}

    ngOnInit() {
        this._configuration_form = this.formBuilder.group({
            // Empty string or null means no initial value. Can be also specific date for
            // example: {date: {year: 2018, month: 10, day: 9}} which sets this date to initial
            // value.
            subscriptionID: ['', Validators.required],
            resourceGroupName: ['', Validators.required],
            appGatewayName: ['', Validators.required]
            // other controls are here...
        });
    }

    onSubmit() {
        let subscriptionID = this._configuration_form.value.subscriptionID;
        let resourceGroupName = this._configuration_form.value.resourceGroupName;
        let appGatewayName = this._configuration_form.value.appGatewayName;

        console.log(subscriptionID, resourceGroupName, appGatewayName);

        localStorage.setItem('subscriptionID', subscriptionID);
        localStorage.setItem('resourceGroupName', resourceGroupName);
        localStorage.setItem('appGatewayName', appGatewayName);
    }

}