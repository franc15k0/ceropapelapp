import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from '../../model/usuario.model';
import { AppConstants } from '../../app.constants';
@Component({
  selector: 'app-informacion-basica',
  templateUrl: './informacion-basica.component.html',
  styleUrls: ['./informacion-basica.component.css'],
})
export class InformacionBasicaComponent implements OnInit {
  titulo: string = 'Información del Ciudadano';
  descripcionDocumento: string;
  nombreRazonSocial: string;
  @Input() usuario: Usuario;
  constructor() { }

  ngOnInit(): void {
    this.descripcionDocumento =
      this.usuario.idTipoDocumento === AppConstants.ID_TIPO_DOCUMENTO_RUC
        ? AppConstants.RUC
        : AppConstants.DNI;
    this.nombreRazonSocial =
      this.usuario.idTipoDocumento === AppConstants.ID_TIPO_DOCUMENTO_RUC
        ? this.usuario.nombres
        : this.usuario.nombres + ' ' + this.usuario.apellidos;
  }
}
