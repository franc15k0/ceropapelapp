import { Component, Input, OnInit } from '@angular/core';
import {
  faCalendarAlt,
  faClock,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Usuario } from '../../model/usuario.model';
import { AuthService } from '../../usuarios/service/auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constants';
@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css'],
})
export class CabeceraComponent implements OnInit {
  date: Date;
  faCalendarAlt = faCalendarAlt;
  faClock = faClock;
  faUserCircle = faUserCircle;
  usuario: Usuario;
  nombre: string;
  constructor(public authService: AuthService, public router: Router) {
    setInterval(() => {
      this.date = new Date();
    }, 1000);
  }

  ngOnInit(): void {
    this.usuario = this.authService.usuario;
    console.log(this.usuario);
    if (this.usuario.tipo === '2') {
      this.nombre = this.usuario.usuario;
    } else {
      if (this.usuario.idTipoDocumento === AppConstants.ID_TIPO_DOCUMENTO_RUC) {
        this.nombre = this.usuario.nombres;
      } else {
        this.nombre = this.usuario.nombres + ' ' + this.usuario.apellidos;
      }
    }
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    swal.fire(
      'Logout',
      `${this.usuario.nombres}, has cerrado sesión con éxito!`,
      'success'
    );

  }
}
