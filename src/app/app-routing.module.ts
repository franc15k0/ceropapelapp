import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './usuarios/login.component';
import { RegistroComponent } from './usuarios/registro/registro.component';
import { BandejaComponent } from './bandeja/bandeja.component';
import { CasillaComponent } from './casilla/casilla.component';
import { NuevoRegistroComponent } from './expediente/nuevo-registro/nuevo-registro.component';
import { ConsultaComponent } from './expediente/consulta/consulta.component';
import { EdicionComponent } from './expediente/edicion/edicion.component';
import { ArchivoComponent } from './casilla/archivo/archivo.component';
import { SeguimientoComponent } from './reportes/seguimiento/seguimiento.component';
import { RepresentanteLegalComponent } from './expediente/representante-legal/representante-legal.component';
import { RegistroRepresentanteComponent } from './expediente/representante-legal/registro-representante/registro-representante.component';
import { RecuperaComponent } from './usuarios/recupera/recupera.component';
const routes: Routes = [
  { path: '', redirectTo: '/bandejaElectronica', pathMatch: 'full' },
  { path: 'registro', component: RegistroComponent },
  { path: 'bandejaElectronica', component: BandejaComponent },
  { path: 'casillaElectronica', component: CasillaComponent },
  { path: 'reporte', component: SeguimientoComponent },
  {
    path: 'archivosNotificacion/:idExpediente/expediente/:nroExpediente/nombre/:nombre',
    component: ArchivoComponent,
  },
  { path: 'registroExpediente', component: NuevoRegistroComponent },
  { path: 'consultaExpediente/:idExpediente', component: ConsultaComponent },
  { path: 'edicionExpediente/:idExpediente', component: EdicionComponent },
  { path: 'perfil', component: RepresentanteLegalComponent },
  { path: 'registroRepresentante', component: RegistroRepresentanteComponent },
  { path: 'recuperaContra', component: RecuperaComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  /*Rutas con NGNIX*/
  /* imports: [RouterModule.forRoot(routes)],*/
  /*Rutas con JBOSS*/
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],


})
export class AppRoutingModule { }
