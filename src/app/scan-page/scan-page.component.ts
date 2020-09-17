import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-scan-page',
    templateUrl: './scan-page.component.html',
    styleUrls: ['./scan-page.component.css']
})
export class ScanPageComponent implements OnInit {
    private stopListening: Function;
    public scannedItems: string[] = [];
    public triedNum: number = 0;
    public origenUrl: string = '';
    public origenData: any = '';
    public startedProcess: string = '';
    public scanningType: string = 'ONED';
    public scannedValue: string = '';
    public isDL: boolean = false;
    public capi: boolean = true;


    public testForm: FormGroup;
    public selectedElement: any;

    constructor(private renderer: Renderer2) {
    }

    ngOnInit() {
        this.testForm = new FormGroup({
            capi: new FormControl('', []),
            capi2: new FormControl('', []),
            sashi: new FormControl('', [])
        });

        this.stopListening = this.renderer.listen('window', 'message', this.handleMessage.bind(this));
    }

    //window.postMessage("test message data", "http://localhost:4200/")
    handleMessage(event: Event) {
        this.triedNum++;
        const message = event as MessageEvent;
        this.origenUrl = message.origin;
        this.origenData = message.data;

        // Only trust messages from the below origin.
        if (message.origin !== window.location.origin) return;

        console.log('\n-------------');
        console.log(message);
        console.log(message.data);
        console.log('-------------\n')
        let body = message.data || null;
        if (body) {
            switch (body.type) {
                case 'KEYBOARDNUM':
                    // console.log(body.value)
                    this.setValueToInput(body.value, body.id);
                    break;
                case 'PDF417':
                    this.isDL = true;
                    this.scannedValue = body.scannedItems;
                    break;
                case 'ONED':
                    this.isDL = false;
                    this.scannedValue = body.scannedItems;
                    break;
                default:
                    console.log('UNKNOWN');
            }
        }

        console.log('handleMessage() finished getting called.')
    }

    // @HostListener('window:message', ['$event'])
    // onMessage(event: Event) {
    //     const message = event as MessageEvent;

    //     if (message.origin !== window.location.origin) return;

    //     console.log(message);
    // }

    ngOnDestroy() {
        console.log('Destroying stuff...');
        this.stopListening();
    }

    public onClick() {
        console.log('Starting');
        this.origenUrl = '';
        this.origenData = '';
        try {
            let value: boolean = (window as any).localStorage.getItem("iOSIpadView");
            if (value) {
                (window as any).webkit.messageHandlers.aktivateStartCameraView.postMessage(this.scanningType);
            } else {
                (window as any).webkit.messageHandlers.aktivateStartCameraView.postMessage(this.scanningType);
            }
            this.startedProcess = "Success";
        } catch (e) {
            this.startedProcess = e;
        }
    }

    public onReset() {
        this.scannedItems = [];
        // this.scannedValue = '';
    }

    public onScanningTypeClick() {
        if (this.scanningType === 'ONED') {
            this.scanningType = 'PDF417'
        } else {
            this.scanningType = 'ONED';
        }
    }

    public onInputClick(e) {
        // e.preventDefault()
        console.log(e);
        if ((window as any).webkit && (window as any).webkit.messageHandlers && !this.selectedElement) {
            let value = this.testForm.get('capi').value;
            (window as any).webkit.messageHandlers.aktivateDeployNumberKeyboard.postMessage({isActive: true, currentValue: value, id: 'capi', maxLength: 4});
        }
    }

    public onInputClick2(e) {
        // e.preventDefault()
        console.log(e);
        if ((window as any).webkit && (window as any).webkit.messageHandlers && !this.selectedElement) {
            let value = this.testForm.get('capi2').value;
            (window as any).webkit.messageHandlers.aktivateDeployNumberKeyboard.postMessage({isActive: true, currentValue: value, id: 'capi2', maxLength: 50});
        }
    }

    public setValueToInput(value, id) {
        // this.testForm.get(id).patchValue(value);
        console.log(value);
        this.testForm.patchValue({
            [id]: value
        });
    }

    public onFocus(event) {
        event.preventDefault();
    }

    public startNewWindow() {
        window.open('https://play.google.com/store/apps/details?id=com.drishya', "hello", "width=200,height=200");
    }

    public noFocus(e) {
        e.preventDefault()
    }
}
