import { Component, OnInit } from '@angular/core';
import { Expediente } from '../../model/expediente.model';
import { AuthService } from '../../usuarios/service/auth.service';
import { Usuario } from '../../model/usuario.model';
import { AppConstants } from '../../app.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { faDownload, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { RegistroExpedienteService } from '../nuevo-registro/registro-expediente.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css'],
})
export class ConsultaComponent implements OnInit {
  tituloNuevoReg: string = 'Consulta de Trámite';
  public expediente: Expediente = new Expediente();
  tituloRegistro: string = 'Detalle del Documento';
  tituloFirma: string = 'Terminos y Condiciones';
  ruta_api: string;
  usuario: Usuario;
  faDownload = faDownload;
  faCheckSquare = faCheckSquare;
  terminos = false;
  private environmentUrl = environment.apiUrlCeroPapel;
  constructor(
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private registroExpedienteService: RegistroExpedienteService
  ) { }

  ngOnInit(): void {
    this.cargarExpediente();
    this.usuario = this.authService.usuario;
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
            console.log(expediente);

            if (expediente) {
              this.expediente = expediente;
              this.terminos =
                expediente.registro.flgDeclaracionJurada === '1'
                  ? true
                  : false;
            }
          });
      }
    });
  }

}
