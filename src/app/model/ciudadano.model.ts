import { Sesion } from './sesion.model';

export class Ciudadano {
    idCiudadano: number;
    numDni: string;
    txtApellidoPaterno: string;
    txtApellidoMaterno: string;
    nombres: string;
    numRuc: string;
    razonSocial: string;
    txtDireccion: string;
    numTelefonoCelular: string;
    txtCorreoElectronico: string;
    txtUbigeo: string;
    idCiudadanoEmpresa: number;
    flgSexo: number;
    fecNacimiento: number;
    idNatural: number;
    idUsuario: string;
    nombresCompleto: string;
    estadoReprese: string;
    fecInicioRep: string;
    fecFinRep: string;
    sesion: Sesion;
}
