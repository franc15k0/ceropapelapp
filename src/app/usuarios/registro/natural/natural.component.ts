import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from '../../../model/usuario.model';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroService } from '../../service/registro.service';
import { ConfirmedValidator } from './../confirmed.validator';
import swal from 'sweetalert2';
import { Sesion } from 'src/app/model/sesion.model';
@Component({
  selector: 'app-natural',
  templateUrl: './natural.component.html',
  styleUrls: ['./natural.component.css'],
})
export class NaturalComponent implements OnInit {
  @Input() usuario: Usuario;
  tituloReg: string = 'Registro del Usuario - Persona Natural';
  isSubmitted: boolean;
  form: FormGroup = new FormGroup({});
  maxDate: Date;
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  constructor(
    private registroService: RegistroService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = fb.group(
      {
        correo: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.pattern(this.emailPattern),
          ],
        ],
        sexo: ['', [Validators.required]],
        fechaNacimiento: ['', [Validators.required]],
        celular: ['', [Validators.required, Validators.minLength(9)]],
        password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]],
      },
      {
        validator: ConfirmedValidator('password', 'confirm_password'),
      }
    );
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  ngOnInit(): void {
    console.log(this.usuario);
  }
  onSubmit() {
    this.isSubmitted = true;
    console.log(this.usuario.numeroDocumento);
    if (this.form.valid) {
      this.usuario.usuario = this.usuario.numeroDocumento;
      this.usuario.contracena = this.form.controls['password'].value;
      this.usuario.correo = this.form.controls['correo'].value;
      this.usuario.telefono1 = this.form.controls['celular'].value;
      this.usuario.flgSexo = this.form.controls['sexo'].value;
      this.usuario.fecNacimiento = this.form.controls['fechaNacimiento'].value;
      const sesion = new Sesion();
      sesion.linkAplicativo = window.location.origin;
      this.usuario.sesion= sesion;
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
                  'Se ha creado con éxito el Usuario',
                  `Estimado usuario ingresar a su correo consignado, asimismo se ha enviado un código a su celular para validarlo`,
                  'success'
                );
                this.router.navigate(['/login']);
              },
              (err) => {
                console.error(err);
                if (err.status === 409) {
                  console.error('-----',err);
                  swal.fire('Alerta', err.error.mensaje, 'warning');

                } else {
                  swal.fire(
                    'Alerta',
                    'Por favor, intentarlo mas tarde',
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
  get campoCelular() {
    return this.form.get('celular') as FormControl;
  }

  get campoCorreo() {
    return this.form.get('correo') as FormControl;
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
