import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { DetalleCompendio } from '../../model/detalle-compendio';
import { RegistroExpedienteService } from '../../expediente/nuevo-registro/registro-expediente.service';
import { AppConstants } from '../../app.constants';
import { Reporte } from '../../model/reporte.model';
import { BandejaService } from '../../service/bandeja.service';
import { AuthService } from '../../usuarios/service/auth.service';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
interface TipoDocumentos {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css'],
})
export class SeguimientoComponent implements OnInit {
  tipoDocumentos: TipoDocumentos[] = [
    { value: '2', viewValue: 'DNI' },
    { value: '1', viewValue: 'RUC' },
  ];
  head = [
    [
      'Nro. Exped',
      'Tip Doc',
      'Nro. Doc',
      'Nombre/Razon Social',
      'Correo Electronico',
      'Descripción',
      'Estado',
      'Fecha Reg',
      'Fecha Env',
    ],
  ];

  columns = [
    { title: 'Expediente', dataKey: 'id' },
    { title: 'Tipo Documento', dataKey: 'name' },
    { title: 'N° Doc.', dataKey: 'Nro. Doc' },
    { title: 'Administrado', dataKey: 'Administrado' },
    { title: 'Correo Electronico', dataKey: 'Correo Electronico' },
    { title: 'Descripción', dataKey: 'Descripción' },
    { title: 'Estado', dataKey: 'Estado' },
    { title: 'F. Registro', dataKey: 'F. Registro' },
    { title: 'F. Envío', dataKey: 'F. Envío' },
  ];

  listReporte: Reporte[];
  config: any;
  tipoEstado: DetalleCompendio[];
  reportepara: Reporte = new Reporte();
  sinTipoSeleccionado = true;
  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;
  constructor(
    private registroExpedienteService: RegistroExpedienteService,
    private bandejaService: BandejaService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.reportepara.codEestaTrami = "";
    this.reportepara.codEtipoDocumento = "";
    this.registroExpedienteService
      .getParametrica(AppConstants.ESTADO)
      .subscribe((estado) => (this.tipoEstado = estado));
    this.bandejaService.getReporte().subscribe((response) => {
      this.listReporte = response;
      this.parsePagination();
      if (this.listReporte.length == 0) {
        /*  swal.fire('Error', 'No se encontraron registros', 'warning'); */
      }
    });
  }
  parsePagination() {
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.listReporte.length,
    };
  }
  buscar() {
    this.bandejaService
      .getReportePara(this.reportepara)
      .subscribe((response) => {
        if (response) {
          this.listReporte = response;
          this.parsePagination();
        } else {
          swal.fire('Error', 'No se encontraron registros', 'warning');
        }
      });
  }
  pageChanged(event) {
    this.config.currentPage = event;
  }
  onSelectDocumento(event: any){
    console.log(event);
    if(event===""){
      this.sinTipoSeleccionado = true;
      this.reportepara.numDocumentoPersona = "";
    }else{
      this.sinTipoSeleccionado = false;
    }
  }
  excell() {
    let newArray: any[] = [];
    let data = Object.values(this.listReporte);
    Object.keys(data).forEach((key, index) => {
      newArray.push({
        'Nro. Exped': data[key].numero,
        'Tip Doc': data[key].descTipoDoc,
        'Nro. Doc': data[key].numDocumentoPersona,
        'Nombre/Razon Social': data[key].nombres,
        'Correo Electronico': data[key].txtCorreoElectronico,
        Descripcion: data[key].txtDescripcionTramite,
        Estado: data[key].descEstaTrami,
        'Fecha Reg': data[key].fecRegistroTramite,
        'Fecha Env': data[key].fecEnvioTramite,
      });
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newArray);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Listado de Documentos');

    /* save to file */
    XLSX.writeFile(wb, 'Reporte_Documentos_Tramite_Cero_Papel.xlsx');
  }
  pdf() {
    var doc = new jsPDF('l', 'mm', [297, 210]);

    doc.setFont('helvetica');

    doc.setFontSize(9);
    const rows = [];
    this.listReporte.forEach((elm) => {
      const temp = [
        elm.numero,
        elm.descTipoDoc,
        elm.numDocumentoPersona,
        elm.nombres,
        elm.txtCorreoElectronico,
        elm.txtDescripcionTramite,
        elm.descEstaTrami,
        elm.fecRegistroTramite,
        elm.fecEnvioTramite,
      ];
      rows.push(temp);
    });

    (doc as any).autoTable({
      body: rows,
      columns: this.columns,
    });
    doc.save('Reporte_Documentos_Tramite_Cero_Papel.pdf');
  }
}
