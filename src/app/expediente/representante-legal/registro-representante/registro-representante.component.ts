import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroExpedienteService } from '../../nuevo-registro/registro-expediente.service';
import { RegistroService } from '../../../usuarios/service/registro.service';
import { Usuario } from '../../../model/usuario.model';
import swal from 'sweetalert2';
import { Ciudadano } from 'src/app/model/ciudadano.model';
import { AuthService } from '../../../usuarios/service/auth.service';
import { Sesion } from 'src/app/model/sesion.model';
@Component({
  selector: 'app-registro-representante',
  templateUrl: './registro-representante.component.html',
  styleUrls: ['./registro-representante.component.css']
})
export class RegistroRepresentanteComponent implements OnInit {
  tituloReg: string = 'Registro de Representante Legal';
  ciudadano: Ciudadano;
  largo = 8;
  isSubmitted: boolean;
  isSubmitteddni: boolean;
  usuario: Usuario;
  form: FormGroup = new FormGroup({});
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  constructor(
    private registroExpedienteService: RegistroExpedienteService,
    private registroService: RegistroService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {
    this.form = fb.group(
      {
        nrodocumento: ['', [Validators.required]],
        correo: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.pattern(this.emailPattern),
          ],
        ],
        sexo: [''],
        fechaNacimiento: [''],
        celular: ['', [Validators.required, Validators.minLength(9)]],
      }
    );
  }

  ngOnInit(): void {
    this.usuario = this.authService.usuario;
  }
  buscarDni($event) {
    // $event.preventDefault();
    this.isSubmitteddni = true;
    if (!this.form.controls['nrodocumento'].value) {
      return;
    }
    const numeroDocumento = this.form.controls['nrodocumento'].value;
    this.registroExpedienteService.getCiudadano(numeroDocumento).subscribe(
      (ciudadano) => {
        if (ciudadano) {


          swal
            .fire({
              title: 'El Ciudadano existe ¿Desea Registrarlo como Representante Legal? (SI/NO)',
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonText: 'NO',
              confirmButtonText: 'SI',
            })
            .then((result) => {
              if (result.value) {
                this.ciudadano = new Ciudadano();
                console.log(this.usuario);
                this.ciudadano.idUsuario = '' + this.usuario.idUsuario;
                this.ciudadano.idCiudadanoEmpresa = this.usuario.idCiudadano;
                this.ciudadano.idNatural = ciudadano.idNatural;
                const sesion = new Sesion();
                sesion.linkAplicativo = window.location.origin;
                this.ciudadano.sesion= sesion;
                this.registroExpedienteService.asignarRepresentanteLegal(this.ciudadano).subscribe(
                  (usuario) => {
                    swal.fire(
                      'Confirmación',
                      `Se ha creado el representante legal con exito`,
                      'success'
                    );
                    this.router.navigate(['/perfil']);
                  },
                  (err) => {
                    console.error(err);
                    console.error('JAJAJAJ');
                    swal.fire(
                      'Alerta',
                      'Por favor, intentarlo mas tarde',
                      'warning'
                    );
                  }
                );



              } else if (result.dismiss === swal.DismissReason.cancel) {
                this.router.navigate(['/perfil']);
                return;
              }
            });


        } else {

          this.registroService.buscarDNI(numeroDocumento).subscribe(
            (reniec) => {

              this.ciudadano = new Ciudadano();
              if (reniec) {
                this.ciudadano.numDni = reniec.dni;
                this.ciudadano.nombres = reniec.nombre;
                this.ciudadano.txtDireccion = reniec.direccion;
                this.ciudadano.txtApellidoMaterno = reniec.apellidoMaterno;
                this.ciudadano.txtApellidoPaterno = reniec.apellidoPaterno;
                this.ciudadano.txtUbigeo = reniec.ubigeo;
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

        }
      },
      (err) => {
        swal.fire(
          'Alerta',
          'El servicio de RENIEC no se encuentra disponible!',
          'warning'
        );
      });


  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.ciudadano.numDni = this.form.controls['nrodocumento'].value;
      this.ciudadano.txtCorreoElectronico = this.form.controls['correo'].value;
      this.ciudadano.numTelefonoCelular = this.form.controls['celular'].value;
      this.ciudadano.flgSexo = this.form.controls['sexo'].value;
      this.ciudadano.fecNacimiento = this.form.controls['fechaNacimiento'].value;
      this.ciudadano.idCiudadanoEmpresa = this.usuario.idCiudadano;
      this.ciudadano.idUsuario = this.usuario.idUsuario.toString();
      const sesion = new Sesion();
      sesion.linkAplicativo = window.location.origin;
      this.ciudadano.sesion= sesion;
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
            this.registroExpedienteService.grabarRepresentanteLegal(this.ciudadano).subscribe(
              (usuario) => {
                swal.fire(
                  'Confirmación',
                  `Se ha creado el representante legal con exito`,
                  'success'
                );
                this.router.navigate(['/perfil']);
              },
              (err) => {
                console.error(err);
                swal.fire(
                  'Alerta',
                  'Por favor, intentarlo mas tarde',
                  'warning'
                );
              }
            );
          } else if (result.dismiss === swal.DismissReason.cancel) {
            this.router.navigate(['/perfil']);
            return;
          }
        });


    }
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
}
