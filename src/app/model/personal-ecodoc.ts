export class PersonalEcodoc {
  idPersonal: number;
  nombres: string;
  apellidos: string;
  cargo: string;
  dni: string;
  unidadOrganica: string;
  correo: string;
  public constructor(init?: Partial<PersonalEcodoc>) {
    Object.assign(this, init);
  }
}
