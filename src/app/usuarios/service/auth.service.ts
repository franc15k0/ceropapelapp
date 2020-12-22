import { Injectable, Output,  EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../../model/usuario.model';
import { Menu } from '../../model/menu.model';
import { environment } from 'src/environments/environment';
import { AppConstants } from 'src/app/app.constants';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private environmentUrlCeroPapel = environment.apiUrlCeroPapel;
  menu$ = new EventEmitter<string>();
  private _usuario: Usuario;
  private _token: string;
  constructor(private http: HttpClient) { }

  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (
      this._usuario == null &&
      sessionStorage.getItem('usuario') != null
    ) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }
  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }
  login(usuario: Usuario): Observable<any> {
    const credenciales = btoa('ceropapelapp' + ':' + '12345');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + credenciales,
    });
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username + '|' + usuario.password);
    params.set('password', usuario.password);
    console.log(params.toString());
    return this.http.post<any>(
      this.environmentUrlCeroPapel + '/oauth/token',
      params.toString(),
      {
        headers: httpHeaders,
      }
    );
  }
  guardarUsuario(accessToken: string): void {
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.idUsuario = payload.idUsuario;
    this._usuario.nombres = payload.nombres;
    this._usuario.apellidos = payload.apellidos;
    this._usuario.correo = payload.correo;
    this._usuario.usuario = payload.usuario;
    this.usuario.idTipoDocumento = payload.tipo;
    this.usuario.tipo = payload.tipoUsuario;
    this.usuario.idCiudadano = payload.idCiudadano;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }
  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }
  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }
  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }
  hasRole(role: string): boolean {
    if (this.usuario.roles.includes(role)) {
      return true;
    }
    return false;
  }
  hasRUC(): boolean {
    if (this.usuario.idTipoDocumento === AppConstants.ID_TIPO_DOCUMENTO_RUC) {
      return true;
    }
    return false;
  }
  hasTipoLDAP(): boolean {
    if (this.usuario.tipo === AppConstants.TIPO_LDAP) {
      return true;
    }
    return false;
  }
  getMenu(idUsuario): Observable<Menu[]> {
    return this.http.get<Menu[]>(
      `${this.environmentUrlCeroPapel}/usuario/menu/${idUsuario}`
    );
  }
  logout(): void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  } 
}
