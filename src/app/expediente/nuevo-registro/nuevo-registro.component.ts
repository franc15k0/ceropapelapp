import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { RegistroExpedienteService } from './registro-expediente.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { DetalleCompendio } from '../../model/detalle-compendio';
import { Registro } from '../../model/registro.model';
import { AppConstants } from '../../app.constants';
import { Expediente } from '../../model/expediente.model';
import { HttpEventType } from '@angular/common/http';
import { Documento } from '../../model/documento.model';
import { AuthService } from '../../usuarios/service/auth.service';
import { Usuario } from '../../model/usuario.model';
import { faTrashAlt, faEdit, faCheckSquare, faDownload } from '@fortawesome/free-solid-svg-icons';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalTerminosComponent } from '../dialogs/modal-terminos/modal-terminos.component';
import { PersonalEcodocComponent } from '../dialogs/personal-ecodoc/personal-ecodoc.component';
import { Archivo } from 'src/app/model/archivo.model';
import { PersonalEcodoc } from 'src/app/model/personal-ecodoc';
import { FirmaDigitalComponent } from '../dialogs/firma-digital/firma-digital.component';
import { environment } from 'src/environments/environment';
import { Obligatorios } from 'src/app/model/obligatorios';
import { ClienteEdoc } from 'src/app/model/cliente-edoc.model';
import { Ciudadano } from 'src/app/model/ciudadano.model';
import { Sesion } from 'src/app/model/sesion.model';
@Component({
  selector: 'app-nuevo-registro',
  templateUrl: './nuevo-registro.component.html',
  styleUrls: ['./nuevo-registro.component.css'],
})
export class NuevoRegistroComponent implements OnInit {
  modalRef: BsModalRef;
  tituloNuevoReg: string = 'Registro de Trámite';
  tituloRegistro: string = 'Detalle del Documento';
  tituloFirma: string = 'Terminos y Condiciones';
  archivoSeleccionada: File;
  progreso: number = 0;
  nombreArchivo: string;
  tipoDocumentofat: DetalleCompendio[];
  tipoSustentofat: DetalleCompendio[];
  tipoSustento: DetalleCompendio[];
  tipoOrgano: DetalleCompendio[];
  expediente: Expediente = new Expediente();
  documentoFormGroup: FormGroup;
  usuario: Usuario;
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;
  faCheckSquare = faCheckSquare;
  faDownload = faDownload;
  ruta_api: string;
  estupa1 = false;
  estupa2 = false;
  nameArchivo = 'Seleccionar Archivo';
  registrado = false;
  textoFormatos = '';
  terminos = false;
  listPersonal: PersonalEcodoc[];
  personalEcodoc: PersonalEcodoc;
  esDocumentoPrincipal = false;
  srcFormato: string;
  representante: Ciudadano;
  private environmentUrl = environment.apiUrlCeroPapel;
  cont = 0;
  constructor(
    private registroExpedienteService: RegistroExpedienteService,
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private modalService: BsModalService
  ) {
    this.documentoFormGroup = this._formBuilder.group({
      codEtipoDocumento: ['', Validators.required],
      txtNumeroArchivo: [''],
      txtDescripcionTramite: [''],
      codEorgano: [''],
      codEsustDocumento: ['', Validators.required],
      terminos: [''],
    });
  }

  ngOnInit(): void {
    this.documentoFormGroup.controls['txtNumeroArchivo'].disable();
    this.usuario = this.authService.usuario;
    this.registroExpedienteService
      .getParametrica(AppConstants.DOCUMENTO)
      .subscribe((documento) => (this.tipoDocumentofat = documento));
    this.registroExpedienteService
      .getParametrica(AppConstants.SUSTENTO)
      .subscribe((sustento) => (this.tipoSustentofat = sustento));
    this.registroExpedienteService
      .getParametrica(AppConstants.ORGANO)
      .subscribe((documento) => (this.tipoOrgano = documento));
    if (this.usuario.idTipoDocumento === AppConstants.ID_TIPO_DOCUMENTO_RUC) {
      this.registroExpedienteService
        .getRepresentanteLegal(this.usuario.idCiudadano)
        .subscribe((response) => {
          this.representante = response.find(
            (c) => c.estadoReprese === 'ACTIVO');
        });
    }
    this.ruta_api = this.environmentUrl + '/api/uploads/file/';
    this.authService.menu$.emit('/registroExpediente');
  //  let stringToReplace = "Hello +-^ my +{}[]@#¢$$$$??? - f4444ò'oóóriends ^ ^^-- ^^^ +!.pdf";
  //  const desired = stringToReplace.replace(/[^\w.\s]/gi, '');
   //console.log(desired);
  }
  onSelectDocumento(event: any) {
    this.tipoSustento = this.tipoSustentofat.filter(
      (item) => item.codElementoTabla.substring(0, 2) == event.substring(0, 2)
    );
    if (event === AppConstants.ES_TUPA_1) {
      this.estupa1 = true;
      this.estupa2 = false;
      this.srcFormato =
        this.environmentUrl + '/assets/formatos/F-01-TUPA-MINAM-Final.docx';
      this.textoFormatos = this.tipoSustento[0].txtDescripcionCorta;
    } else if (event === AppConstants.ES_TUPA_2) {
      this.estupa2 = true;
      this.estupa1 = false;
      this.srcFormato =
        this.environmentUrl + '/assets/formatos/F-02-TUPA-MINAM-Final.docx';
      this.textoFormatos = this.tipoSustento[0].txtDescripcionCorta;
    } else {
      this.estupa2 = false;
      this.estupa1 = false;
    }
  }
  onSelectOrgano(event){}
  onSelectSustento(event) {

    if (event.substring(2, 4) === '01') {
      this.documentoFormGroup.controls['txtNumeroArchivo'].enable();
      this.esDocumentoPrincipal = true;
    } else {
      this.esDocumentoPrincipal = false;
      this.documentoFormGroup.controls['txtNumeroArchivo'].setValue('');
      this.documentoFormGroup.controls['txtNumeroArchivo'].disable();
    }
  }
  seleccionarArchivo(event) {
    this.archivoSeleccionada = event.target.files[0];
    this.progreso = 0;
    this.nameArchivo = event.target.files[0].name.replace(/[^\w.\s]/gi, '');

    if(!this.documentoFormGroup.controls['codEsustDocumento'].value){
      swal.fire(
        'Aviso:',
        'Debe elegir el tipo de archivo',
        'warning'
      );
      this.archivoSeleccionada = null;
      this.nameArchivo = 'Seleccionar Archivo';
      //return;
    }
    if (this.esDocumentoPrincipal && this.archivoSeleccionada.type.indexOf('application/pdf') < 0) {
      swal.fire(
        'Aviso: seleccionar pdf: ',
        'El archivo principal debe ser del tipo PDF',
        'warning'
      );
      this.archivoSeleccionada = null;
    }
  }
  /*   guardarExpediente(): void {
    this.registroExpedienteService.guardarExpe(this.expediente).subscribe(
      (e) => {
        swal.fire(
          `El Expediente con Numero ${e.idRegistro}`,
          `se ha sido registrado con éxito`,
          'success'
        );
      },
      (err) => {
        swal.fire(
          'Lo Sentimos',
          'No se grabó el registro, por favor contáctese con el administrador',
          'error'
        );
        console.error('codigo de error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  } */
  subirDocumento() {
    if (!this.archivoSeleccionada) {
      swal.fire('Error Upload: ', 'Debe seleccionar un Archivo', 'error');
    } else {
      this.registroExpedienteService
        .subirArchivo(this.archivoSeleccionada)
        .subscribe(
          (event) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progreso = Math.round((event.loaded / event.total) * 100);
            } else if (event.type === HttpEventType.Response) {
              let response: any = event.body;
              this.nombreArchivo = response.nombreFinal as string;

              /* swal.fire(
                'El archivo se ha procesado!',
                response.mensaje,
                'success'
              ); */
              this.pushDocumento();
            }
          },
          (err) => {
            swal.fire(
              'Alerta',
              'El tamaño del archivo a excedido el maximo permitido 25 MB',
              'warning'
            );
            this.progreso = 0;
          }
        );
    }
  }
  pushDocumento() {
    this.progreso = 0;
    if (!this.documentoFormGroup.valid) {
      swal.fire(
        'Validación',
        'Los campos Archivo y Documento son Necesarios',
        'error'
      );
      return;
    }
    let repetido: Archivo = this.expediente.archivos.find(
      (d) =>
        d.codEsustDocumento ===
        this.documentoFormGroup.controls['codEsustDocumento'].value
    );
    console.log(this.expediente.archivos);
    if (repetido) {
      swal.fire(
        'Validación',
        'El Documento ya se encuentra registrado',
        'warning'
      );
      return;
    }

    const archivoCurrent = new Archivo(this.documentoFormGroup.getRawValue());

    let documento: DetalleCompendio = this.tipoDocumentofat.find(
      (t) =>
        t.codElementoTabla.substring(2, 4) ===
        this.documentoFormGroup.controls['codEtipoDocumento'].value.substring(
          2,
          4
        )
    );
    let sustento: DetalleCompendio = this.tipoSustentofat.find(
      (s) => s.codElementoTabla === archivoCurrent.codEsustDocumento
    );
    console.log('sustento.txtDescripcionCorta:' + sustento.txtDescripcionCorta);
    try {
      archivoCurrent.descTipoSustento = sustento.txtDescripcionCorta;

    } catch (error) {
      swal.fire('Validación', 'El tipo de Archivo es necesario', 'error');
      return;
    }

    archivoCurrent.flgEsprincipal =
      archivoCurrent.codEsustDocumento.substring(2.4) ===
        AppConstants.ES_PRINCIPAL
        ? '1'
        : '0';
    if (archivoCurrent.flgEsprincipal === '1') archivoCurrent.flgEstaFirmado = '0';
    console.log(archivoCurrent);

    if (archivoCurrent.codEsustDocumento.substring(2, 4) === '01') {
      archivoCurrent.txtNumeroArchivo =
        archivoCurrent.txtNumeroArchivo === ''
          ? 'NI'
          : archivoCurrent.txtNumeroArchivo;
      this.documentoFormGroup.controls['txtNumeroArchivo'].disable();
    }

    archivoCurrent.txtNombreArchivo = this.nombreArchivo;
    archivoCurrent.nombreArchivo = this.nameArchivo;
    this.documentoFormGroup.controls['codEtipoDocumento'].disable();
    archivoCurrent.descTipoDocumento = documento.txtDescripcionCorta;

    this.expediente.archivos.push(archivoCurrent);
    this.documentoFormGroup.controls['txtNumeroArchivo'].setValue('');
    this.documentoFormGroup.controls['codEsustDocumento'].setValue('');
    this.nameArchivo = 'Seleccione Archivo';
    this.archivoSeleccionada = null;
    this.documentoFormGroup.get('codEsustDocumento').clearValidators();
    this.documentoFormGroup.get('codEsustDocumento').updateValueAndValidity();
  }
  eliminarSustento(archivo: Archivo) {

    swal
      .fire({
        title: '¿Está seguro de Elimnar el Archivo?  (SI/NO)',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'NO',
        confirmButtonText: 'SI',
      })
      .then((result) => {
        if (result.value) {
          const index: number = this.expediente.archivos.indexOf(archivo);
          if (index !== -1) {
            this.expediente.archivos.splice(index, 1);
            this.registroExpedienteService.eliminarArchivo(archivo.txtNombreArchivo).subscribe(
              (err) => console.log(err)
            );
          }
          if (this.expediente.archivos.length === 0) {
            this.documentoFormGroup.controls['codEtipoDocumento'].enable();
          }

        } else if (result.dismiss === swal.DismissReason.cancel) {
          return;
        }
      });
  }
  onSubmit() { }
  grabarRegistro() {
    let listaArchOblig = '';
    let archivoPrincipalFirmado = false;
    let obligatorios: Array<Obligatorios> = [];
    if (this.usuario.idTipoDocumento === AppConstants.ID_TIPO_DOCUMENTO_RUC) {
      console.log('Representante', this.representante);
      if (!this.representante) {
        const representante = new Obligatorios();
        representante.numero = this.cont;
        representante.descripcion = 'Representante Legal';
        this.cont++;
        obligatorios.push(representante);
      }
    }
    if (
      this.documentoFormGroup.controls['txtDescripcionTramite'].value === ''
    ) {
      const documendes = new Obligatorios();
      documendes.numero = this.cont;
      documendes.descripcion = 'Descripción';
      this.cont++;
      obligatorios.push(documendes);
    }
    if (this.expediente.archivos.length === 0) {
      const documendos = new Obligatorios();
      documendos.numero = this.cont;
      documendos.descripcion = 'Documento';
      this.cont++;
      obligatorios.push(documendos);
    } else {
      let listaSustentosObligatorios = this.tipoSustento.filter(
        (item) => item.txtReferencia2 === AppConstants.ES_OBLIGATORIO
      );

      listaSustentosObligatorios.forEach((obj) => {
        let archivo = this.expediente.archivos.find(
          (d) => d.codEsustDocumento === obj.codElementoTabla
        );

        if (!archivo) {
          const documenObl = new Obligatorios();
          documenObl.numero = this.cont;
          documenObl.descripcion = obj.txtDescripcionCorta;
          obligatorios.push(documenObl);
          this.cont++;
        } else {
          if (archivo.flgEstaFirmado === '1') {
            archivoPrincipalFirmado = true;
          }
        }
      });
    }
    if (!this.terminos && !archivoPrincipalFirmado) {
      const documenterm = new Obligatorios();
      documenterm.numero = this.cont;
      documenterm.descripcion = 'Declaracion Jurada';
      obligatorios.push(documenterm);
      this.cont++;
    }
    const registro: Registro = new Registro();
    registro.txtDescripcionTramite = this.documentoFormGroup.controls[
      'txtDescripcionTramite'
    ].value;

    registro.codEorgano = this.documentoFormGroup.controls[
      'codEorgano'
    ].value;
    console.log( 'organo',this.documentoFormGroup.controls[
      'codEorgano'
    ].value);
    registro.idCiudadano = this.usuario.idCiudadano;
    registro.flgDeclaracionJurada = this.terminos ? '1' : '0';
    this.expediente.registro = registro;
    const documento: Documento = new Documento();
    documento.codEtipoDocumento = this.documentoFormGroup.controls[
      'codEtipoDocumento'
    ].value;
    this.expediente.documento = documento;
    this.expediente.usuario = this.usuario;
    const sesion = new Sesion();
    sesion.linkAplicativo = window.location.origin;
    this.expediente.sesion = sesion;
    console.log(this.expediente);
    this.registroExpedienteService.guardarExpe(this.expediente).subscribe(
      (b) => {
        this.expediente.registro = b;
        this.registrado = true;
        console.log(obligatorios.length);
        if (obligatorios.length > 0) {
          this.router.navigate(['/bandejaElectronica']);

          listaArchOblig = listaArchOblig + '<br><ul>';
          obligatorios.forEach((o) => {
            listaArchOblig =
              listaArchOblig +
              '<li type="circle" style="display:block;">*' +
              o.descripcion +
              '</li>';
          });
          listaArchOblig = listaArchOblig + '</ul>';
          swal.fire({
            title: 'Registro de Expediente',
            icon: 'info',
            html: `Se ha registrado el tramite con N° ${b.numeroCeroPapel}  pero tiene pendiente los siguientes requisitos:
              ${listaArchOblig}`,
            focusConfirm: false,
          });
        } else {
          swal
            .fire({
              title:
                'Se completaron los Documentos ¿Desea enviar el Expediente?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonText: 'NO, Despues',
              confirmButtonText: 'SI',
            })
            .then((result) => {
              if (result.value) {
                this.enviarRegistroEcodoc();
              } else if (result.dismiss === swal.DismissReason.cancel) {
                this.router.navigate(['/bandejaElectronica']);
                return;
              }
            });
        }
      },
      (err) => {
        swal.fire('Lo Sentimos', 'Error en el Registro', 'error');
        console.error('codigo de error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }
  enviarRegistroEcodoc() {
    const cliente: ClienteEdoc = new ClienteEdoc();
    if (this.usuario.idTipoDocumento === AppConstants.ID_TIPO_DOCUMENTO_RUC) {
      cliente.idTipoCliente = AppConstants.ES_RUC_ECODOC;
      cliente.numeroIdentificacion = this.usuario.usuario;
      this.expediente.clienteEdoc = cliente;
      this.abrirModalPersonal(cliente);
    } else {
      cliente.idTipoCliente = AppConstants.ES_DNI_ECODOC;
      cliente.numeroIdentificacion = this.usuario.usuario;
      this.expediente.clienteEdoc = cliente;
      this.insertarRegistrosEcodocSinPersonal();
    }
  }
  insertarRegistrosEcodocSinPersonal() {
    this.registroExpedienteService.enviarExpe(this.expediente).subscribe(
      (r) => {
        swal.fire(
          'Envío de Expediente',
          `Se ha enviado con exito el Expediente con N° ${r.numero}`,
          'success'
        );
        this.router.navigate(['/bandejaElectronica']);
      },
      (err) => {
        swal.fire('Lo Sentimos', 'Error en el Registro', 'error');
        console.error('codigo de error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }

  insertarRegistrosEcodocConPersonal(personal: PersonalEcodoc) {
    this.expediente.personalEcodoc = personal;
    console.log('insertarRegistrosEcodocConPersonal');
    console.log(this.expediente.personalEcodoc);
    this.registroExpedienteService.enviarExpe(this.expediente).subscribe(
      (r) => {
        swal.fire(
          'Envío de Expediente',
          `Se ha enviado con exito el Expediente con N° ${r.numero}`,
          'success'
        );
        this.router.navigate(['/bandejaElectronica']);
      },
      (err) => {
        swal.fire('Lo Sentimos', 'Error en el Registro', 'error');
        console.error('codigo de error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }

  get campoSustent() {
    return this.documentoFormGroup.get('codEsustDocumento') as FormControl;
  }
  abrirTerminos() {
    this.modalRef = this.modalService.show(ModalTerminosComponent, {
      /*  class: 'modal-lg modal-dialog-centered', */
      initialState: {
        title: 'Términos y condiciones',
        data: {},
      },
    });
  }
  abrirModalPersonal(cliente: ClienteEdoc) {
    this.modalRef = this.modalService.show(PersonalEcodocComponent, {
      initialState: {
        title: 'Verificar Personal',
        data: cliente,
      },
    });

    this.modalRef.content.onClose.subscribe((result) => {
      console.log(result);
      if (result) {
        if (result.idPersonal) {
          this.insertarRegistrosEcodocSinPersonal();
        } else {
          this.insertarRegistrosEcodocConPersonal(result);
        }

      }
    });
  }
  abrirModalFirmaDigital(nombreArchivo, index) {
    console.log(nombreArchivo);
    this.registroExpedienteService.encodeNombreArchivo(nombreArchivo).subscribe(encode => {
      this.modalRef = this.modalService.show(FirmaDigitalComponent, {
        backdrop: 'static',
        keyboard: false,
        initialState: {
          title: 'Firma Digital',
          data: encode,
        },
      });

      this.modalRef.content.onClose.subscribe((result) => {
        console.log(result);
        this.expediente.archivos[index].flgEstaFirmado = result;
      });
    });
  }

}
