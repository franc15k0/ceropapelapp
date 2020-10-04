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
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DetalleCompendio } from '../../model/detalle-compendio';
import { Expediente } from '../../model/expediente.model';
import { Registro } from '../../model/registro.model';
import { PersonalEcodoc } from 'src/app/model/personal-ecodoc';
import { ClienteEdoc } from 'src/app/model/cliente-edoc.model';
import { Ciudadano } from '../../model/ciudadano.model';
// @ts-ignore
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
import { ExpedienteEcodoc } from 'src/app/model/expediente-ecodoc';
const moment = _rollupMoment || _moment;
@Injectable({
  providedIn: 'root',
})
export class RegistroExpedienteService {
  private environmentUrl = environment.apiUrlCeroPapel;

  constructor(private http: HttpClient, private router: Router) { }
  getParametrica(tabla): Observable<DetalleCompendio[]> {
    return this.http.get<DetalleCompendio[]>(
      `${this.environmentUrl}/api/expediente/parametricacorta/${tabla}`
    );
  }
  guardarExpe(expediente: Expediente): Observable<Registro> {
    return this.http
      .post(this.environmentUrl + '/api/expediente', expediente)
      .pipe(
        map((response: any) => response.registro as Registro),
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
  enviarExpe(expediente: Expediente): Observable<any> {
    return this.http
      .put<any>(this.environmentUrl + '/api/expediente', expediente)
      .pipe(
        map((response: any) => response.expediente as ExpedienteEcodoc),
        catchError((e) => {
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }
  subirArchivo(archivo: File): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('archivo', archivo);

    const req = new HttpRequest(
      'POST',
      `${this.environmentUrl}/api/expediente/upload`,
      formData,
      {
        reportProgress: true,
      }
    );

    return this.http.request(req);
  }
  getExpediente(idRegistro): Observable<Expediente> {
    return this.http
      .get<Expediente>(`${this.environmentUrl}/api/expediente/${idRegistro}`)
      .pipe(
        map((response) => {
          let expediente = response as Expediente;
          if (expediente.registro.flgDeclaracionJurada) expediente.registro.flgDeclaracionJurada = expediente.registro.flgDeclaracionJurada.replace(/\s/g, '');
          expediente.archivos = expediente.archivos.map((archivo) => {
            archivo.descTipoDocumento = expediente.documento.descTipoDocumento;
            archivo.nombreArchivo = archivo.txtNombreArchivo.split('-')[1];
            return archivo;
          });

          return expediente;
        })
      );
  }
  actualizarExpe(expediente: Expediente): Observable<Registro> {
    return this.http
      .post(this.environmentUrl + '/api/expediente/upd', expediente)
      .pipe(
        map((response: any) => response.registro as Registro),
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
  buscarPersonal(cliente: ClienteEdoc): Observable<any> {
    return this.http
      .put<any>(this.environmentUrl + '/api/expediente/buscarPersonal', cliente)
      .pipe(
        map((response: any) => response.personal as PersonalEcodoc[]),
        catchError((e) => {
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }
  buscarPersonalDni(cliente: ClienteEdoc): Observable<any> {
    return this.http
      .put<any>(this.environmentUrl + '/api/expediente/buscarPersonalDni', cliente)
      .pipe(
        map((response: any) => response.personal as PersonalEcodoc[]),
        catchError((e) => {
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }
  getIdFirma(): Observable<number> {
    return this.http
      .get<number>(` ${this.environmentUrl}/api/expediente/idfirma`)
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
  /*   getFirma(idfirma): Observable<FirmaDigital> {
      console.log(idfirma);
      return this.http
        .get<FirmaDigital>(
          `${this.environmentUrl}/api/expediente/firma/${idfirma}`
        )
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
    } */
  getRepresentanteLegal(idCiudadano): Observable<Ciudadano[]> {
    console.log(idCiudadano);
    return this.http
      .get<Ciudadano>(
        `${this.environmentUrl}/api/expediente/representantelegal/${idCiudadano}`
      )
      .pipe(
        map((response: any) => {
          console.log(response);
          let representantes = response as Ciudadano[];
          return representantes.map((representante) => {
            if (representante.fecInicioRep) {
              var momentVariable = moment(
                representante.fecInicioRep,
                'YYYYMMDD HH:mm:ss'
              );
              representante.fecInicioRep = momentVariable.format('DD/MM/YYYY HH:mm:ss');
            }
            if (representante.fecFinRep) {
              var momentVariable2 = moment(representante.fecFinRep, 'YYYYMMDD HH:mm:ss');
              representante.fecFinRep = momentVariable2.format('DD/MM/YYYY HH:mm:ss');
            }
            return representante;
          });
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
  getCiudadano(numDni): Observable<Ciudadano> {
    console.log(numDni);
    return this.http
      .get<Ciudadano>(
        `${this.environmentUrl}/api/expediente/ciudadanonatural/${numDni}`
      )
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
  grabarRepresentanteLegal(ciudadano: Ciudadano): Observable<Ciudadano> {
    if (ciudadano.fecNacimiento) {
      const constFecNacimiento = new Date(ciudadano.fecNacimiento);
      ciudadano.fecNacimiento = moment(constFecNacimiento).format(
        'YYYYMMDD'
      );
    }
    return this.http
      .post(this.environmentUrl + '/api/expediente/representantelegal/grabar', ciudadano)
      .pipe(
        map((response: any) => response.registro as Ciudadano),
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
  asignarRepresentanteLegal(ciudadano: Ciudadano): Observable<Ciudadano> {
    return this.http
      .post(this.environmentUrl + '/api/expediente/representantelegal/asignar', ciudadano)
      .pipe(
        map((response: any) => response.registro as Ciudadano),
        catchError((e) => {
          return throwError(e);
        })
      );
  }
  eliminarArchivo(nombreArchivo): Observable<string> {
    return this.http
      .get(`${this.environmentUrl}/api/uploads/eliminar/${nombreArchivo}`, { responseType: 'text' })
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
  encodeNombreArchivo(nombreArchivo): Observable<string> {
    return this.http
      .get(`${this.environmentUrl}/api/expediente/encodearchivo/${nombreArchivo}`, { responseType: 'text' })
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
}
