import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { AppConstants } from 'src/app/app.constants';
import { RegistroService } from '../service/registro.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Usuario } from 'src/app/model/usuario.model';
interface TipoDocumentos {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-recupera',
  templateUrl: './recupera.component.html',
  styleUrls: ['./recupera.component.css']
})
export class RecuperaComponent implements OnInit {
  usuarioValidado = false;
  isSubmitted: boolean;
  tipoDocumento = '01';
  tituloBusq: string = 'Recuperar Contraseña';
  largo = 8;
  form: FormGroup = new FormGroup({});
  tipoDocumentos: TipoDocumentos[] = [
    { value: '01', viewValue: 'DNI' },
    { value: '06', viewValue: 'RUC' },
  ];
  constructor(private fb: FormBuilder,
    private registroService: RegistroService,
    private router: Router) {
    this.form = fb.group({
      nrodocumento: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {

    this.isSubmitted = false;
  }
  onSelectTipDoc(event: any) {
    this.tipoDocumento = event;
    this.form.controls['nrodocumento'].setValue('');
    if (event === AppConstants.ID_TIPO_DOCUMENTO_DNI) {
      this.largo = 8;
    } else {
      this.largo = 11;
    }
  }
  enviarInformacionRecuperar($event) {

    const numeroDocumento = this.form.controls['nrodocumento'].value;
    this.registroService.recuperaContrasena(numeroDocumento).subscribe(
      (ok) => {

        swal.fire(
          'Recuperar Contraseña',
          `Estimado usuario ingresar a su correo consignado, asimismo se ha enviado un código a su celular para validarlo`,
          'success'
        );
        this.router.navigate(['/login']);
        //  console.log(reniec);
      },

      (err) => {
        console.log(err);
        swal.fire(
          'Alerta',
          'Favor de Intentar mas tarde!',
          'warning'
        );
      }
    );

  }
  onSubmit() {


  }
  validarDocumento($event) {
    this.isSubmitted = true;
    if (this.form.valid) {
      const usuario: Usuario = new Usuario();
      usuario.idTipoDocumento = this.tipoDocumento;
      usuario.usuario = this.form.controls['nrodocumento'].value;;

      this.registroService.buscarUsuario(usuario).subscribe(
        (usuario) => {
          this.usuarioValidado = true;
          this.form.controls['nrodocumento'].disable();
          swal.fire(
            'Alerta',
            'Usuario Verificado, puede recuperar contraseña!',
            'success'
          );
        },
        (err) => {
          console.log(err);
          swal.fire(
            'Alerta',
            'El Usuario no esta Registrado en el Sistema!',
            'warning'
          );
        }
      );

    }

  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  limpiar() {
    this.isSubmitted = false;
    this.form.reset();
    this.usuarioValidado = false;
    this.form.controls['nrodocumento'].enable();
  }
  get f() {
    return this.form.controls;
  }
}
