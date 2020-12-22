import { Component, OnInit, Input } from '@angular/core';
import { Ubigeo } from '../../../model/ubigeo.model';
import { RegistroService } from '../../service/registro.service';
import { Usuario } from '../../../model/usuario.model';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { ConfirmedValidator } from '../confirmed.validator';
import { AppConstants } from 'src/app/app.constants';
import { Sesion } from 'src/app/model/sesion.model';

@Component({
  selector: 'app-juridica',
  templateUrl: './juridica.component.html',
  styleUrls: ['./juridica.component.css'],
})
export class JuridicaComponent implements OnInit {
  tituloReg: string = 'Registro del Usuario - Persona Juridica';
  isSubmitted: boolean;
  regiones: Ubigeo[];
  provincias: Ubigeo[];
  distritos: Ubigeo[];
  nacional: boolean;
  @Input() usuario: Usuario;
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  form: FormGroup = new FormGroup({});
  constructor(
    private registroService: RegistroService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = fb.group(
      {
        region: ['', [Validators.required]],
        provincia: ['', [Validators.required]],
        distrito: ['', [Validators.required]],
        direccionentidad: ['', [Validators.required]],
        correo: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.pattern(this.emailPattern),
          ],
        ],
        numPartidaElectronica: [''],
        numAsientoRegistral: [''],
        celular: ['', [Validators.required, Validators.minLength(9)]],
        password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]],
      },
      {
        validator: ConfirmedValidator('password', 'confirm_password'),
      }
    );
  }

  ngOnInit(): void {
    console.log(this.usuario);
    this.registroService
      .getUbigeo(null)
      .subscribe((regiones) => (this.regiones = regiones));
    this.nacional = true;
  }
  onSelectUbigeo(event: any, tipo) {
    console.log(event);
    if (event === AppConstants.INTERNACIONAL) {
      this.nacional = false;
      this.limpiarValidacionNac();
    }
    this.registroService.getUbigeo(event).subscribe((ubigeos) => {
      if (tipo === 'prov') {
        this.provincias = ubigeos;
        this.distritos = [];
      } else if (tipo === 'dist') {
        this.distritos = ubigeos;
      } else {
        this.distritos = [];
      }
    });
  }
  limpiarValidacionNac() {
    this.form.get('provincia').clearValidators();
    this.form.get('provincia').updateValueAndValidity();
    this.form.get('distrito').clearValidators();
    this.form.get('distrito').updateValueAndValidity();
  }
  onSubmit() {
    this.isSubmitted = true;
    console.log(this.usuario.numeroDocumento);
    if (this.form.valid) {
      this.usuario.usuario = this.usuario.numeroDocumento;
      this.usuario.contracena = this.form.controls['password'].value;
      this.usuario.direccion = this.form.controls['direccionentidad'].value;
      this.usuario.correo = this.form.controls['correo'].value;
      this.usuario.telefono1 = this.form.controls['celular'].value;
      this.usuario.numAsientoRegistral = this.form.controls['numAsientoRegistral'].value;
      this.usuario.numPartidaElectronica = this.form.controls['numPartidaElectronica'].value;
      const sesion = new Sesion();
      sesion.linkAplicativo = window.location.origin;
      this.usuario.sesion= sesion;
      if (this.nacional) {
        this.usuario.ubigeo = this.form.controls['distrito'].value;
      } else {
        this.usuario.ubigeo = this.form.controls['region'].value;
      }
      console.log(this.usuario);
      swal
        .fire({
          title: '¿Está seguro de guardar la información ingresada?  (SI/NO)',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonText: 'NO',
          confirmButtonText: 'SI',
        })
        .then((result) => {
          if (result.value) {

            this.registroService.saveUsuario(this.usuario).subscribe(
              (usuario) => {
                swal.fire(
                  'Registro de Usuario',
                  `Estimado usuario ingresar a su correo consignado, asimismo se ha enviado un código a su celular para validarlo`,
                  'success'
                );
                this.router.navigate(['/login']);
              },
              (err) => {
                console.error(err);
                if (err.status === 409) {
                  swal.fire('Alerta', err.error.error, 'warning');

                } else {
                  swal.fire(
                    'Alerta',
                    'Por favor,Reintentarlo mas tarde',
                    'warning'
                  );
                }
              }
            );

          } else if (result.dismiss === swal.DismissReason.cancel) {
            /*  this.router.navigate(['/bandejaElectronica']); */
            return;
          }
        });

      console.log('form validated');
    } else {
      console.log('form not validated');
    }
  }
  get f() {
    return this.form.controls;
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
