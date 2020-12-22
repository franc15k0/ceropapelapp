import { Sesion } from './sesion.model';

export class Notificacion {
  idExpediente: string;
  idRegistro: string;
  idCiudadano: string;
  estado: string;
  estadoProceso: string;
  descripcion: string;
  numeroExpediente: string;
  fechaSalida: string;
  estadoNotificacion: string;
  fecSalidaDesde: string;
  fecSalidaHasta: string;
  idUsuario: string;
  nombreDocumento: string;
  numeroCeroPapel: string;
  sesion: Sesion;
}
