import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-modal-terminos',
  templateUrl: './modal-terminos.component.html',
  styleUrls: ['./modal-terminos.component.css'],
})
export class ModalTerminosComponent implements OnInit {
  title;
  constructor(public modalRef: BsModalRef) {}

  ngOnInit(): void {}
}
