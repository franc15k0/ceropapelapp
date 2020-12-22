import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-firma-digital',
  templateUrl: './firma-digital.component.html',
  styleUrls: ['./firma-digital.component.css'],
})
export class FirmaDigitalComponent implements OnInit {
  @ViewChild('iframe', { static: false }) iframe: ElementRef;
  src: string;
  urlSafe: SafeResourceUrl;
  data;
  title;
  firmaDigitalExito = '0';
  public onClose: Subject<string>;
  private environmentUrl = environment.apiUrlCeroPapel;

  constructor(private sanitizer: DomSanitizer, public modalRef: BsModalRef) {

    (<any>window).receiveDataFromIframe = this.receiveDataFromIframe.bind(this);
  }
  @HostListener('window:message', ['$event'])
  receiveDataFromIframe(event: MessageEvent) {
    if (event.data === 'exito') {
      this.firmaDigitalExito = '1';
    }
    if (event.data === 'close') {
      this.onClose.next(this.firmaDigitalExito);
      this.modalRef.hide();
    }
  }

  ngOnInit(): void {
    console.log(this.data);
    this.src = `${this.environmentUrl}/firma/index/${this.data}`;
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
    this.onClose = new Subject();
  }
  salirModal() {
    this.onClose.next(this.firmaDigitalExito);
    this.modalRef.hide();
  }
}
