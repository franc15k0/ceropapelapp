import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../app/usuarios/service/auth.service';
import { faArchive, faBook, faBoxOpen, faEdit, faFilePdf, faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  faArchive = faArchive;
  faBook = faBook;
  faBoxOpen = faBoxOpen;
  faEdit = faEdit;
  faFilePdf = faFilePdf;
  faAddressBook = faAddressBook;
  constructor(
    private spinner: NgxSpinnerService,
    public authService: AuthService,
    public router: Router
  ) { }
  title = 'ceropapelapp';
  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }
}
