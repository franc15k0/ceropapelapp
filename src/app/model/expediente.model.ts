import { Documento } from './documento.model';
import { Registro } from './registro.model';
import { Archivo } from './archivo.model';
import { Usuario } from './usuario.model';
import { PersonalEcodoc } from './personal-ecodoc';
/* import { FirmaDigital } from './firma-digital.model'; */
import { ClienteEdoc } from './cliente-edoc.model';
export class Expediente {
  registro: Registro;
  documento: Documento;
  usuario: Usuario;
  //firmaDigital: FirmaDigital;
  clienteEdoc: ClienteEdoc;
  personalEcodoc: PersonalEcodoc;
  archivos: Array<Archivo> = [];
}
