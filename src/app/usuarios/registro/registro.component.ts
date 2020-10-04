import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Usuario } from '../../model/usuario.model';
import { RegistroService } from '../service/registro.service';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import swal from 'sweetalert2';
import { AppConstants } from 'src/app/app.constants';

interface TipoDocumentos {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  tituloBusq: string = 'Búsqueda del Usuario';

  usuario: Usuario;
  largo = 8;
  @ViewChild('nrodocumento')
  myInputVariable: ElementRef;
  /*   nacional: boolean; */
  isSubmitted: boolean;
  tipoDocumento = '01';
  tipoDocumentos: TipoDocumentos[] = [
    { value: '01', viewValue: 'DNI' },
    { value: '06', viewValue: 'RUC' },
  ];
  form: FormGroup = new FormGroup({});

  constructor(
    private registroService: RegistroService,
    private fb: FormBuilder
  ) {
    this.isSubmitted = false;
    this.usuario = new Usuario();
    this.form = fb.group({
      nrodocumento: ['', [Validators.required]],
    });
  }
  get f() {
    return this.form.controls;
  }
  ngOnInit(): void { }
  buscarDocumento($event) {
    // $event.preventDefault();
    this.isSubmitted = true;
    if (!this.form.valid) {

      return;
    }
    const numeroDocumento = this.form.controls['nrodocumento'].value;
    console.log(this.tipoDocumento);
    if (this.tipoDocumento === AppConstants.ID_TIPO_DOCUMENTO_DNI) {
      this.registroService.buscarDNI(numeroDocumento).subscribe(
        (reniec) => {
          if (reniec) {
            this.usuario.numeroDocumento = reniec.dni;
            this.usuario.nombres = reniec.nombre;
            this.usuario.direccion = reniec.direccion;

            this.usuario.apellidos =
              reniec.apellidoPaterno + ' ' + reniec.apellidoMaterno;
            this.usuario.apellidoMaterno = reniec.apellidoMaterno;
            this.usuario.apellidoPaterno = reniec.apellidoPaterno;
            this.usuario.txtUbigeo = reniec.ubigeo;
            this.usuario.idTipoDocumento = AppConstants.ID_TIPO_DOCUMENTO_DNI;
          } else {
            swal.fire(
              'Alerta',
              'El número de DNI ingresado no es el correcto',
              'warning'
            );
          }
          //  console.log(reniec);
        },
        (err) => {
          swal.fire(
            'Alerta',
            'El servicio de RENIEC no se encuentra disponible!',
            'warning'
          );
        }
      );
    } else if (this.tipoDocumento === AppConstants.ID_TIPO_DOCUMENTO_RUC) {
      this.registroService.buscarRUC(numeroDocumento).subscribe(
        (sunat) => {
          if (sunat) {
            this.usuario.nombres = sunat.razonSocial;
            this.usuario.apellidos = sunat.razonSocial;
            this.usuario.numeroDocumento = this.form.controls[
              'nrodocumento'
            ].value;
            this.usuario.correo = 'mail@mail.com';
            this.usuario.telefono1 = '99999999';
            this.usuario.idTipoDocumento = AppConstants.ID_TIPO_DOCUMENTO_RUC;
          } else {
            swal.fire(
              'Alerta',
              'El número de RUC ingresado no es el correcto',
              'warning'
            );
          }
        },
        (err) => {
          console.error(err);
          swal.fire(
            'Alerta',
            'El servicio de Consulta no se encuentra disponible!',
            'warning'
          );
        }
      );
    }
  }

  onSelectTipDoc(event: any) {
    this.tipoDocumento = event;
    this.form.controls['nrodocumento'].setValue('');
    if (event === AppConstants.ID_TIPO_DOCUMENTO_DNI) {
      this.largo = 8;
    } else {
      this.largo = 11;
    }

    this.usuario = new Usuario();
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onSubmit() {
    //this.isSubmitted = true;
  }
}
