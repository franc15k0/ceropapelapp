import { Component, OnInit, Inject } from '@angular/core';
import { BandejaService } from '../service/bandeja.service';
import { AuthService } from '../usuarios/service/auth.service';
import { Usuario } from '../model/usuario.model';
import { Registro } from '../model/registro.model';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { DetalleCompendio } from '../model/detalle-compendio';
import { RegistroExpedienteService } from '../expediente/nuevo-registro/registro-expediente.service';
import { AppConstants } from '../app.constants';

@Component({
  selector: 'app-bandeja',
  templateUrl: './bandeja.component.html',
  styleUrls: ['./bandeja.component.css'],
})
export class BandejaComponent implements OnInit {
  usuario: Usuario;
  listRegistros: Registro[];
  pageAcual: number = 1;
  config: any;
  filterRegistro = '';
  filterExpediente = '';
  registropara: Registro = new Registro();
  tipoEstado: DetalleCompendio[];
  constructor(
    private router: Router,
    private bandejaService: BandejaService,
    private registroExpedienteService: RegistroExpedienteService,
    public authService: AuthService

  ) { }

  ngOnInit(): void {
    console.log(".............."+window.location.origin);
    this.registropara.codEestaTrami = "";
    this.usuario = this.authService.usuario;
    this.registroExpedienteService
      .getParametrica(AppConstants.ESTADO)
      .subscribe((estado) => (this.tipoEstado = estado));
    const registro: Registro = new Registro();
    registro.idCiudadano = this.usuario.idCiudadano;
    this.bandejaService.getBandeja(registro).subscribe((response) => {
      this.listRegistros = response;
      this.parsePagination();
      if (this.listRegistros.length == 0) {
        /*  swal.fire('Error', 'No se encontraron registros', 'warning'); */
      }
      console.log(this.listRegistros);
    });
    this.authService.menu$.emit('/bandejaElectronica');
  }
  public getRowClass(row): any {
    return { color: row.indEstvalida === 'I' ? 'red' : 'black' };
  }
  public irRegistro(idRegistro, estado): void {
    if (estado === AppConstants.ESTADO_ENVIADO || estado === AppConstants.ESTADO_NOTIFICADO || estado === AppConstants.ESTADO_RECHAZADO) {
      this.router.navigate(['/consultaExpediente/' + idRegistro], {
        skipLocationChange: true,
      });
    } else if (estado === AppConstants.ESTADO_REGISTRADO) {
      this.router.navigate(['/edicionExpediente/' + idRegistro], {
        skipLocationChange: true,
      });
    }
  }
  pageChanged(event) {
    this.config.currentPage = event;
  }
  buscar() {
    this.registropara.idCiudadano = this.usuario.idCiudadano;
    this.bandejaService.getBandeja(this.registropara).subscribe((response) => {
      if (response) {
        this.listRegistros = response;
        this.parsePagination();
      } else {
        swal.fire('Error', 'No se encontraron registros', 'warning');
      }
    });

  }

  parsePagination() {
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.listRegistros.length,
    };
  }
  onLoadFrame() { }
}
