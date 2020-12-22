import { Injectable, Output,  EventEmitter } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {
  HttpClient,
  HttpParams,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario } from '../../model/usuario.model';
import { Reniec } from '../../model/reniec.model';
import { environment } from 'src/environments/environment';
import { Sunat } from '../../model/sunat.model';
import { Ubigeo } from '../../model/ubigeo.model';
// @ts-ignore
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
const moment = _rollupMoment || _moment;
@Injectable({
  providedIn: 'root',
})
export class RegistroService {
  private environmentUrl = environment.apiUrlCeroPapel;
  constructor(private http: HttpClient, private router: Router) { }
  @Output() fire: EventEmitter<any> = new EventEmitter();
  buscarDNI(numerodocumento): Observable<Reniec> {
    console.log('dd' + numerodocumento);
    return this.http
      .get<Reniec>(
        `${this.environmentUrl}/usuario/validacion/reniec/${numerodocumento}`
      )
      .pipe(
        map((response) => {
          if (response.coResultado !== '0000') {
            return null;
          }
          return response;
        }),
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
  buscarRUC(numerodocumento): Observable<Sunat> {
    return this.http
      .get<Sunat>(
        `${this.environmentUrl}/usuario/validacion/sunat/${numerodocumento}`
        /* ,   {       responseType: 'text',       } */
      )
      .pipe(
        map((response) => {
          if (response.coResultado !== '0000') {
            return null;
          }
          return response;
        }),
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

  saveUsuario(usuario: Usuario): Observable<Usuario> {
    if (usuario.fecNacimiento) {
      const constFecNacimiento = new Date(usuario.fecNacimiento);
      usuario.fecNacimiento = moment(constFecNacimiento).format(
        'YYYYMMDD'
      );
    }

    return this.http.post(this.environmentUrl + '/usuario/alta', usuario).pipe(
      map((response: any) => response.usuario as Usuario),
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
  getUbigeo(padre): Observable<Ubigeo[]> {
    return this.http.get<Ubigeo[]>(
      `${this.environmentUrl}/usuario/ubigeo/${padre}`
    );
  }
  recuperaContrasena(numeroDocumento): Observable<string> {

    return this.http
      .get(`${this.environmentUrl}/usuario/recuperar/${numeroDocumento}`, { responseType: 'text' })
      .pipe(
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

  buscarUsuario(usuario: Usuario): Observable<any> {
    return this.http
      .put<any>(this.environmentUrl + '/usuario/buscar', usuario)
      .pipe(
        map((response: any) => response.usuario as Usuario),
        catchError((e) => {
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }
 
}
