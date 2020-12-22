import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../model/usuario.model';
import { CasillaService } from '../../service/casilla.service';
import { AuthService } from '../../usuarios/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Notificacion } from 'src/app/model/notifiacion.model';
import { ArchivoNotificacion } from 'src/app/model/archivo-notificacion';
import { environment } from 'src/environments/environment';
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons';
import { Sesion } from 'src/app/model/sesion.model';
declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-archivo',
  templateUrl: './archivo.component.html',
  styleUrls: ['./archivo.component.css'],
})
export class ArchivoComponent implements OnInit {
  usuario: Usuario;
  listArchivoNotificacion: ArchivoNotificacion[];
  idExpediente: string;
  nroExpediente: string;
  nombreDocumento: string;
  rutaapi: string;
  private environmentUrl = environment.apiUrlCeroPapel;
  faCloudDownloadAlt = faCloudDownloadAlt;
  constructor(
    private casillaService: CasillaService,
    public authService: AuthService,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.usuario = this.authService.usuario;
    this.cargarListaArchivos();
    this.rutaapi = this.environmentUrl + '/api/uploads/ecodoc/';
  }
  cargarListaArchivos() {
    this.activeRoute.params.subscribe((params) => {
      let id = params['idExpediente'];
      let nro = params['nroExpediente'];
      let nombre = params['nombre'];
      console.log(nombre);
      this.nroExpediente = nro;
      this.nombreDocumento = nombre;
      if (id) {
        this.idExpediente = id;
        const notificacion: Notificacion = new Notificacion();
        notificacion.idExpediente = id;
        notificacion.idCiudadano = this.usuario.idCiudadano.toString();
        const sesion = new Sesion();
        sesion.linkAplicativo = window.location.origin;
        notificacion.sesion = sesion;
        this.casillaService
          .getArchivosNotificacion(notificacion)
          .subscribe((archivos) => {
            if (archivos) {
              this.listArchivoNotificacion = archivos;
            }
          });
      }
    });
  }
  downloadFile(url: string, fileName: string) {
    console.log('............');
    FileSaver.saveAs(url, fileName);
  }
}
