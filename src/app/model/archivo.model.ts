export class Archivo {
  idArchivo: number;
  idDocumento: number;
  txtNumeroArchivo: string;
  flgEsprincipal: string;
  flgEstaFirmado: string;
  codEsustDocumento: string;
  txtNombreArchivo: string;
  descTipoSustento: string;
  nombreArchivo: string;
  descTipoDocumento: string;
  accion: string;
  public constructor(init?: Partial<Archivo>) {
    Object.assign(this, init);
  }
}
