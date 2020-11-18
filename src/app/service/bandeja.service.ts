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
import { Registro } from '../model/registro.model';
// @ts-ignore
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
import { Reporte } from '../model/reporte.model';
const moment = _rollupMoment || _moment;
@Injectable({
  providedIn: 'root',
})
export class BandejaService {
  private environmentUrl = environment.apiUrlCeroPapel;

  constructor(private http: HttpClient, private router: Router) { }

  getBandeja(para: Registro): Observable<Registro[]> {
    console.log(para.fecRegistroDesde);
    if (para.fecRegistroDesde) {
      if (typeof para.fecRegistroDesde === 'string') {
        // this is a string
      } else {
        const constFecRegistroDesde = new Date(para.fecRegistroDesde);
        para.fecRegistroDesde = moment(constFecRegistroDesde).format(
          'YYYYMMDD'
        );
      }
    }
    if (para.fecRegistroHasta) {
      if (typeof para.fecRegistroHasta === 'string') {
        // this is a string
      } else {
        const constfecRegistroHasta = new Date(para.fecRegistroHasta);
        para.fecRegistroHasta = moment(constfecRegistroHasta).format(
          'YYYYMMDD'
        );
      }
    }
    return this.http
      .put<Registro[]>(
        this.environmentUrl + '/api/expediente/bandejaelectronica',
        para
      )
      .pipe(
        map((response: any) => {
          console.log(response);
          let registros = response.listaRegistro as Registro[];
          return registros.map((registro) => {

            if (registro.fecRegistroTramite) {
              //   console.log(registro.fecRegistroTramite);
              var momentVariable = moment(
                registro.fecRegistroTramite,
                'YYYYMMDD HH:mm:ss'
              );
              registro.fecRegistroTramite = momentVariable.format('DD/MM/YYYY HH:mm:ss');
            }
            return registro;
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

  getReporte(): Observable<Reporte[]> {
    return this.http.get(`${this.environmentUrl}/api/expediente/reporte`).pipe(
      map((response) => {
        let reportes = response as Reporte[];

        return reportes.map((reporte) => {
          if (reporte.fecRegistroTramite) {
            var momentVariable = moment(reporte.fecRegistroTramite, 'YYYYMMDD');
            reporte.fecRegistroTramite = momentVariable.format('DD/MM/YYYY');
          }
          if (reporte.fecEnvioTramite) {
            var momentVariable2 = moment(reporte.fecEnvioTramite, 'YYYYMMDD');
            reporte.fecEnvioTramite = momentVariable2.format('DD/MM/YYYY');
          }
          return reporte;
        });
      })
    );
  }
  getReportePara(para: Reporte): Observable<Reporte[]> {
    console.log(para.fecRegistroDesd);
    console.log(para.fecRegistroHast);
    console.log(para.fecEnviaDesd);
    console.log(para.fecEnviaHast);
    if (para.fecRegistroDesd) {

      if (typeof para.fecRegistroDesd !== 'string') {
        const constFecRegistroDesde = new Date(para.fecRegistroDesd);
        para.fecRegistroDesd = moment(constFecRegistroDesde).format('YYYYMMDD');
      }

    }
    if (para.fecRegistroHast) {
      if (typeof para.fecRegistroHast !== 'string') {
        const constfecRegistroHasta = new Date(para.fecRegistroHast);
        para.fecRegistroHast = moment(constfecRegistroHasta).format('YYYYMMDD');
      }

    }
    if (para.fecEnviaDesd) {
      if (typeof para.fecEnviaDesd !== 'string') {
        const constfecEnviaDesd = new Date(para.fecEnviaDesd);
        para.fecEnviaDesd = moment(constfecEnviaDesd).format('YYYYMMDD');
      }

    }
    if (para.fecEnviaHast) {
      if (typeof para.fecEnviaHast !== 'string') {
        const constfecEnviaHast = new Date(para.fecEnviaHast);
        para.fecEnviaHast = moment(constfecEnviaHast).format('YYYYMMDD');
      }

    }
 /*    if(para.codEestaTrami===''){
        para.codEestaTrami = null;
    }
    if(para.codEtipoDocumento===''){
      para.codEtipoDocumento = null;
     } */
     if(para.numDocumentoPersona===''){
      para.numDocumentoPersona = null;
     }
    return this.http
      .put<Reporte[]>(this.environmentUrl + '/api/expediente/reporte', para)
      .pipe(
        map((response: any) => {
          console.log(response);
          let reportes = response.listaReporte as Reporte[];
          return reportes.map((reporte) => {
            if (reporte.fecRegistroTramite) {
              var momentVariable = moment(
                reporte.fecRegistroTramite,
                'YYYYMMDD'
              );
              reporte.fecRegistroTramite = momentVariable.format('DD/MM/YYYY');
            }
            if (reporte.fecEnvioTramite) {
              var momentVariable2 = moment(reporte.fecEnvioTramite, 'YYYYMMDD');
              reporte.fecEnvioTramite = momentVariable2.format('DD/MM/YYYY');
            }
            return reporte;
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
}
