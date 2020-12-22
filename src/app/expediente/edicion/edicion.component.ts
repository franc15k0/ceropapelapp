import { Component, OnInit } from '@angular/core';
import { Expediente } from '../../model/expediente.model';
import { AuthService } from '../../usuarios/service/auth.service';
import { Usuario } from '../../model/usuario.model';
import { AppConstants } from '../../app.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroExpedienteService } from '../nuevo-registro/registro-expediente.service';
import { DetalleCompendio } from '../../model/detalle-compendio';
import { Registro } from '../../model/registro.model';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { Documento } from '../../model/documento.model';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
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
  selector: 'app-edicion',
  templateUrl: './edicion.component.html',
  styleUrls: ['./edicion.component.css'],
})
export class EdicionComponent implements OnInit {
  tituloNuevoReg: string = 'Edicion de Trámite';
  public expediente: Expediente = new Expediente();
  tituloRegistro: string = 'Detalle del Documento';
  tituloFirma: string = 'Terminos y Condiciones';
  usuario: Usuario;
  tipoDocumentofat: DetalleCompendio[];
  tipoSustentofat: DetalleCompendio[];
  tipoSustento: DetalleCompendio[];
  tipoOrgano: DetalleCompendio[];
  estupa1 = false;
  estupa2 = false;
  nameArchivo = 'Seleccionar Archivo';
  registrado = false;
  textoFormatos = '';
  terminos = false;
  archivoSeleccionada: File;
  progreso: number = 0;
  nombreArchivo: string;
  representante: Ciudadano;
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;
  faCheckSquare = faCheckSquare;
  faDownload = faDownload;
  documentoFormGroup: FormGroup;
  modalRef: BsModalRef;
  archivosDel: Archivo[] = [];
  listPersonal: PersonalEcodoc[];
  personalEcodoc: PersonalEcodoc;
  estaFirmado = false;
  cont = 0;
  srcFormato: string;
  flgDeclaracionJurada: string;
  tempFlg: string;
  esDocumentoPrincipal = false;
  ruta_api: string;
  numero_cero_papel:string;
  private environmentUrl = environment.apiUrlCeroPapel;
  constructor(
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private registroExpedienteService: RegistroExpedienteService,
    private modalService: BsModalService
  ) {
    this.documentoFormGroup = this._formBuilder.group({
      codEtipoDocumento: ['', Validators.required],
      codEorgano: [''],
      txtDescripcionTramite: [''],
      txtNumeroArchivo: [''],
      codEsustDocumento: ['', Validators.required],
      terminos: [''],
    });
  }

  ngOnInit(): void {
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
    this.documentoFormGroup.controls['txtNumeroArchivo'].disable();
    this.cargarExpediente();
    this.ruta_api = this.environmentUrl + '/api/uploads/file/';
    this.authService.menu$.emit('/registroExpediente');
  }
  cargarExpediente() {
    this.activeRoute.params.subscribe((params) => {
      let id = params['idExpediente'];
      if (id) {
        this.registroExpedienteService
          .getExpediente(id)
          .subscribe((expediente) => {
            if (expediente) {

              this.expediente = expediente;
              this.documentoFormGroup.controls[
                'txtDescripcionTramite'
              ].setValue(expediente.registro.txtDescripcionTramite);

              if (expediente.archivos.length > 0) {
                this.documentoFormGroup.controls['codEtipoDocumento'].setValue(
                  expediente.documento.codEtipoDocumento
                );
                if(expediente.registro.codEorgano)
                this.documentoFormGroup.controls['codEorgano'].setValue(
                  expediente.registro.codEorgano
                );

                this.llenarSustento(expediente.documento.codEtipoDocumento);
                this.documentoFormGroup.controls['codEtipoDocumento'].disable();
              }
              this.terminos =
                expediente.registro.flgDeclaracionJurada === '1'
                  ? true
                  : false;
               this.numero_cero_papel= this.expediente.registro.numeroCeroPapel;
            }
          });
      }
    });

  }
  onSelectDocumento(event: any) {
    this.llenarSustento(event);
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

  llenarSustento(tipoDocumento) {
    this.tipoSustento = this.tipoSustentofat.filter(
      (item) =>
        item.codElementoTabla.substring(0, 2) == tipoDocumento.substring(0, 2)
    );
    console.log(this.tipoSustento);
  }

  seleccionarArchivo(event) {
    this.archivoSeleccionada = event.target.files[0];
    this.progreso = 0;
    this.nameArchivo = event.target.files[0].name;

    if (this.esDocumentoPrincipal && this.archivoSeleccionada.type.indexOf('application/pdf') < 0) {
      swal.fire(
        'Aviso: seleccionar pdf: ',
        'El archivo principal debe ser del tipo PDF',
        'warning'
      );
      this.archivoSeleccionada = null;
    }
  }
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

              this.pushDocumento();
            }
          },
          (err) => {
            swal.fire(
              'Alerta',
              'Se ha presentado un error intentar mas tarde',
              'warning'
            );
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
    archivoCurrent.accion = AppConstants.INSERT;
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
        title: '¿Está seguro de Eliminar el Archivo?  (SI/NO)',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'NO',
        confirmButtonText: 'SI',
      })
      .then((result) => {
        if (result.value) {
          console.log('archivo.accion:', archivo.accion)
          if (!archivo.accion) {
            archivo.accion = AppConstants.DEL;
            this.archivosDel.push(archivo);
          }
          if (archivo.accion == AppConstants.INSERT) {
            this.registroExpedienteService.eliminarArchivo(archivo.txtNombreArchivo).subscribe(
              (err) => console.log(err)
            );
          }
          const index: number = this.expediente.archivos.indexOf(archivo);
          if (index !== -1) {
            this.expediente.archivos.splice(index, 1);
          }
          if (this.expediente.archivos.length === 0) {
            this.documentoFormGroup.controls['codEtipoDocumento'].enable();
          }
          console.log(this.archivosDel);
        } else if (result.dismiss === swal.DismissReason.cancel) {
          return;
        }
      });

  }
  onSubmit() { }
  onSelectOrgano(event){}
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
    console.log('descripcion', this.documentoFormGroup.controls['txtDescripcionTramite'].value);
    if (
      this.documentoFormGroup.controls['txtDescripcionTramite'].value === '' ||
      !this.documentoFormGroup.controls['txtDescripcionTramite'].value
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
          const documenob = new Obligatorios();
          documenob.numero = this.cont;
          documenob.descripcion = obj.txtDescripcionCorta;
          this.cont++;
          obligatorios.push(documenob);
        } else {
          if (archivo.flgEstaFirmado === '1') {
            archivoPrincipalFirmado = true;
          }
        }
      });
    }

    if (!this.terminos && !archivoPrincipalFirmado) {
      const documendj = new Obligatorios();
      documendj.numero = this.cont;
      documendj.descripcion = 'Declaracion Jurada,';
      this.cont++;
      obligatorios.push(documendj);
    }


    const registro: Registro = new Registro();
    registro.idRegistro = this.expediente.registro.idRegistro;
    registro.txtDescripcionTramite =
    this.documentoFormGroup.controls['txtDescripcionTramite'].value;
    registro.codEorgano =
    this.documentoFormGroup.controls['codEorgano'].value;
    registro.idCiudadano = this.usuario.idCiudadano;

    registro.flgDeclaracionJurada = this.terminos ? '1' : '0';

    this.expediente.registro = registro;
    const documento: Documento = new Documento();
    documento.idDocumento = this.expediente.documento.idDocumento;
    documento.codEtipoDocumento = this.documentoFormGroup.controls[
      'codEtipoDocumento'
    ].value;
    this.expediente.documento = documento;
    this.expediente.usuario = this.usuario;
    const sesion = new Sesion();
    sesion.linkAplicativo = window.location.origin;
    this.expediente.sesion = sesion;
    this.archivosDel.forEach((obj) => {
      this.expediente.archivos.push(obj);
    });
    this.registroExpedienteService.actualizarExpe(this.expediente).subscribe(
      (b) => {
        this.expediente.registro = b;
        this.registrado = true;
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
          console.log(listaArchOblig);
          console.log(this.numero_cero_papel);
          swal.fire({
            title: 'Registro de Expediente',
            icon: 'info',
            html: `Se ha registrado el tramite con el siguiente Nro. ${this.numero_cero_papel}  pero tiene pendiente los siguientes requisitos:
              ${listaArchOblig}`,
            focusConfirm: false,
          });
        } else {
          swal
            .fire({
              title:
                'Se completaron los Documentos ¿Desea envíar el Expediente?',
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
    cliente.numeroIdentificacion = this.usuario.usuario;
    if (this.usuario.idTipoDocumento === AppConstants.ID_TIPO_DOCUMENTO_RUC) {
      cliente.idTipoCliente = AppConstants.ES_RUC_ECODOC;
      this.expediente.clienteEdoc = cliente;
      this.abrirModalPersonal(cliente);
    } else {
      cliente.idTipoCliente = AppConstants.ES_DNI_ECODOC;
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
          `Se ha resgitrado con exito el Expediente con N° ${r.numero}`,
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
      initialState: {
        title: 'Terminos y condiciones',
        data: {},
      },
    });
  }

  abrirModalPersonal(cliente: ClienteEdoc) {
    this.modalRef = this.modalService.show(PersonalEcodocComponent, {
      initialState: {
        title: 'Es necesario registrar Personal',
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
  onSelectSustento(event) {
    console.log(event.substring(2, 4));
    if (event.substring(2, 4) === '01') {
      this.documentoFormGroup.controls['txtNumeroArchivo'].enable();
      this.esDocumentoPrincipal = true;
    } else {
      this.esDocumentoPrincipal = false;
      this.documentoFormGroup.controls['txtNumeroArchivo'].setValue('');
      this.documentoFormGroup.controls['txtNumeroArchivo'].disable();
    }
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
