import { Injectable } from '@angular/core';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {
  HttpClient,
  HttpParams,
  HttpRequest,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { formatDate, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Notificacion } from '../model/notifiacion.model';
// @ts-ignore
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
import { ArchivoNotificacion } from '../model/archivo-notificacion';
const moment = _rollupMoment || _moment;
@Injectable({
  providedIn: 'root',
})
export class CasillaService {
  private environmentUrl = environment.apiUrlCeroPapel;

  constructor(private http: HttpClient, private router: Router) { }

  getNotificacion(noitificacion: Notificacion): Observable<Notificacion[]> {

    if (noitificacion.fecSalidaDesde) {

      if (typeof noitificacion.fecSalidaDesde !== 'string') {
        const fecSalidaDesde = new Date(noitificacion.fecSalidaDesde);
        noitificacion.fecSalidaDesde = moment(fecSalidaDesde).format('YYYYMMDD');
      }

    }
    if (noitificacion.fecSalidaHasta) {

      if (typeof noitificacion.fecSalidaHasta !== 'string') {
        const fecSalidaHasta = new Date(noitificacion.fecSalidaHasta);
        noitificacion.fecSalidaHasta = moment(fecSalidaHasta).format('YYYYMMDD');
      }

    }
    console.log(noitificacion.idUsuario);
    return this.http
      .put<Notificacion[]>(
        this.environmentUrl + '/api/expediente/notificacion',
        noitificacion
      )
      .pipe(
        map((response: any) => {
          console.log(response);
          let notificaciones = response.listaNotificacion as Notificacion[];
          return notificaciones.map((notificacion) => {
            if (notificacion.fechaSalida) {
              var momentVariable = moment(notificacion.fechaSalida, 'YYYYMMDD');
              notificacion.fechaSalida = momentVariable.format('DD/MM/YYYY');
            }
            return notificacion;
          });
        }),
        catchError((e) => {
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }
  getArchivosNotificacion(
    notificacion: Notificacion
  ): Observable<ArchivoNotificacion[]> {
    console.log(notificacion.idExpediente);
    console.log(notificacion.idCiudadano);
    let param = new HttpParams()
      .set('idExpediente', notificacion.idExpediente)
      .set('idCiudadano', notificacion.idCiudadano);
    return this.http
      .get<ArchivoNotificacion[]>(
        `${this.environmentUrl}/api/expediente/archivonotificacion`,
        { params: param }
      )
      .pipe(
        map((response) => response as ArchivoNotificacion[]),
        catchError((e) => {
          if (e.status == 400) {
            return throwError(e);
          }
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }
  /*
  getCasillaEstado(para: Registropara): Observable<Registro[]> {
    let param = new HttpParams()
      .set('idPersona', para.idPersona)
      .set('estado', para.codEestaTrami);

    return this.http
      .get<Registro[]>(
        `${this.environmentUrl}/api/expediente/casillaelectronica/estado`,
        { params: param }
      )
      .pipe(
        map((response) => {
          let registros = response as Registro[];

          return registros.map((registro) => {
            var momentVariable = moment(
              registro.fecRegistroTramite,
              'YYYYMMDD'
            );
            console.log(registro.fecRegistroTramite);
            registro.fecRegistroTramite = momentVariable.format('DD/MM/YYYY');
            return registro;
          });
        })
      );
  } */
}
