import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../app/usuarios/service/auth.service';

import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { Menu } from './model/menu.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {


  constructor(
    private spinner: NgxSpinnerService,
    public authService: AuthService,
    public router: Router
  ) {}
  title = 'ceropapel';
  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);

  }
}
