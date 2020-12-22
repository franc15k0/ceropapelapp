import { Sesion } from './sesion.model';
import { Valido } from './valido.model';

export class Usuario {
  /*  framework*/
  username: string;
  password: string;
  ldap: string;
  roles: string[] = [];
  /*model*/
  numeroDocumento: string;
  /* tipoDocumento: string; */
  idUsuario: number;
  usuario: string;
  contracena: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono1: string;
  estadoRegistro: string;
  direccion: string;
  estado: boolean;
  situacion: string;
  tipo: string;
  /* tipoPersona: string; */
  idCiudadano: number;
  apellidoPaterno: string;
  apellidoMaterno: string;
  ubigeo: string;
  txtUbigeo: string;
  flgSexo: string;
  fecNacimiento: string;
  numAsientoRegistral: string;
  numPartidaElectronica: string;
  idTipoDocumento: string;
  valido: Valido;
  sesion: Sesion;
}
