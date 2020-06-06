import { Component, OnInit, Renderer2 } from '@angular/core';

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
    public receivedValue: string = ''

    constructor(private renderer: Renderer2) {
        this.stopListening =
            renderer.listen('window', 'message', this.handleMessage.bind(this));
    }

    ngOnInit() {
    }

    //window.postMessage("test message data", "http://localhost:4200/")
    handleMessage(event: Event) {
        this.triedNum++;
        const message = event as MessageEvent;
        this.origenUrl = message.origin;
        this.origenData = message.data;

        // Only trust messages from the below origin.
        if (message.origin !== window.location.origin) return;

        console.log(message.data);
        this.receivedValue = 'RECEIVED'

        // if (message.data instanceof String) {
        this.scannedValue = message.data;
        // }
    }

    // @HostListener('window:message', ['$event'])
    // onMessage(event: Event) {
    //     const message = event as MessageEvent;

    //     if (message.origin !== window.location.origin) return;

    //     console.log(message);
    // }

    ngOnDestroy() {
        this.stopListening();
    }

    public onClick() {
        console.log('Starting');
        this.receivedValue = '';
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
        this.scannedValue = '';
    }

    public onScanningTypeClick() {
        if (this.scanningType === 'ONED') {
            this.scanningType = 'PDF417'
        } else {
            this.scanningType = 'ONED';
        }
    }

}
