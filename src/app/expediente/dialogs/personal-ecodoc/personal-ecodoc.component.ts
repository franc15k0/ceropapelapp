import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { RegistroService } from '../../../usuarios/service/registro.service';
import { RegistroExpedienteService } from '../../nuevo-registro/registro-expediente.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import swal from 'sweetalert2';
import { PersonalEcodoc } from 'src/app/model/personal-ecodoc';
import { ClienteEdoc } from 'src/app/model/cliente-edoc.model';

@Component({
  selector: 'app-personal-ecodoc',
  templateUrl: './personal-ecodoc.component.html',
  styleUrls: ['./personal-ecodoc.component.css'],
})
export class PersonalEcodocComponent implements OnInit {
  title;
  data;
  form: FormGroup = new FormGroup({});
  listPersonal: PersonalEcodoc[];
  isSubmitted: boolean;
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  personal: PersonalEcodoc;
  public onClose: Subject<PersonalEcodoc>;
  constructor(
    public modalRef: BsModalRef,
    private registroService: RegistroService,
    private registroExpedienteService: RegistroExpedienteService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = fb.group({
      correo: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(this.emailPattern),
        ],
      ],
      cargo: ['', [Validators.required]],
      unidadOrganica: ['', [Validators.required]],
      dni: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.onClose = new Subject();
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  buscarDocumento($event) {
    const numeroDocumento = this.form.controls['dni'].value;
    const cliente: ClienteEdoc = this.data;
    cliente.dni = numeroDocumento;
    this.registroExpedienteService.buscarPersonalDni(cliente).subscribe(
      (response) => {
        console.log('buscarPersonalDni');
        console.log(response.length);
        if (response.length > 0) {
          this.listPersonal = response;
          const personalE: PersonalEcodoc = new PersonalEcodoc();
          personalE.idPersonal = 100;
          this.onClose.next(personalE);
          this.modalRef.hide();
        } else {
          this.registroService.buscarDNI(numeroDocumento).subscribe(
            (reniec) => {
              console.log(reniec);
              this.personal = new PersonalEcodoc();
              if (reniec) {
                this.title = 'Es Necesario Registrar al Personal'
                this.personal.nombres = reniec.nombre;
                this.personal.apellidos =
                  reniec.apellidoPaterno + ' ' + reniec.apellidoMaterno;
              } else {
                swal.fire('Error Registro', 'La persona no se encuentra!', 'error');
              }
            },
            (err) => {
              swal.fire('Error Registro', 'Sin servicio!', 'error');
            }
          );
        }
      }
    )


  }
  get f() {
    return this.form.controls;
  }
  onSubmit() {
    this.isSubmitted = true;
    console.log('onSubmit');
    console.log(this.form.valid);

    if (!this.form.valid) {
      return;
    }
    const personalE: PersonalEcodoc = new PersonalEcodoc(this.form.value);
    personalE.apellidos = this.personal.apellidos;
    personalE.nombres = this.personal.nombres;
    this.onClose.next(personalE);
    this.modalRef.hide();
  }
  salirModal() {
    this.modalRef.hide();
    this.router.navigate(['/bandejaElectronica']);
  }
}
