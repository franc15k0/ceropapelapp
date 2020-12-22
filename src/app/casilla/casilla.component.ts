import { Component, OnInit } from '@angular/core';
import { Usuario } from '../model/usuario.model';
import { CasillaService } from '../service/casilla.service';
import { AuthService } from '../usuarios/service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Notificacion } from '../model/notifiacion.model';
import { AppConstants } from '../app.constants';
import swal from 'sweetalert2';
import { Sesion } from '../model/sesion.model';
@Component({
  selector: 'app-casilla',
  templateUrl: './casilla.component.html',
  styleUrls: ['./casilla.component.css'],
})
export class CasillaComponent implements OnInit {
  usuario: Usuario;
  listNotificacion: Notificacion[];
  config: any;
  filterExpediente = '';
  notificacionpara: Notificacion = new Notificacion();
  constructor(
    private router: Router,
    private casillaService: CasillaService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.usuario = this.authService.usuario;
    const notifiacion: Notificacion = new Notificacion();
    notifiacion.idCiudadano = '' + this.usuario.idCiudadano;
    notifiacion.idUsuario = '' + this.usuario.idUsuario;
    const sesion = new Sesion();
    sesion.linkAplicativo = window.location.origin;
    notifiacion.sesion = sesion;
    this.casillaService.getNotificacion(notifiacion).subscribe((response) => {
      this.listNotificacion = response;
      this.parsePagination();
    });
    this.authService.menu$.emit('/casillaElectronica');
  }
  parsePagination() {
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.listNotificacion.length,
    };
  }
  pageChanged(event) {
    this.config.currentPage = event;
  }
  public irArchivo(notificacion: Notificacion): void {
    console.debug(notificacion.nombreDocumento);
    if (notificacion.estadoNotificacion === AppConstants.DESC_NOTIFICADO) {
      this.router.navigate(['archivosNotificacion', notificacion.idExpediente, 'expediente', notificacion.numeroExpediente, 'nombre', notificacion.nombreDocumento]);
    } else {
      this.router.navigate(['/consultaExpediente/' + notificacion.idRegistro], {
        skipLocationChange: true,
      });
    }

  }
  buscar() {
    console.log(this.usuario.idUsuario);
    this.notificacionpara.idCiudadano = '' + this.usuario.idCiudadano;
    this.notificacionpara.idUsuario = '' + this.usuario.idUsuario;
    this.casillaService
      .getNotificacion(this.notificacionpara)
      .subscribe((response) => {
        if (response) {
          this.listNotificacion = response;
          this.parsePagination();
        } else {
          swal.fire('Error', 'No se encontraron registros', 'warning');
        }
      });
  }
}
