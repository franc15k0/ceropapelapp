import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './usuarios/login.component';
import { RegistroComponent } from './usuarios/registro/registro.component';

import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';
import { SphttpInterceptor } from './usuarios/interceptors/sphttp.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { BandejaComponent } from './bandeja/bandeja.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalTerminosComponent } from './expediente/dialogs/modal-terminos/modal-terminos.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipe } from './bandeja/pipes/filter.pipe';
import { ExpedientePipe } from './casilla/pipes/expediente.pipe';
import { MatDatepickerModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ConsultaComponent } from './expediente/consulta/consulta.component';
import { EdicionComponent } from './expediente/edicion/edicion.component';
import { NuevoRegistroComponent } from './expediente/nuevo-registro/nuevo-registro.component';
import { PersonalEcodocComponent } from './expediente/dialogs/personal-ecodoc/personal-ecodoc.component';
import { FirmaDigitalComponent } from './expediente/dialogs/firma-digital/firma-digital.component';
import { CasillaComponent } from './casilla/casilla.component';
import { ArchivoComponent } from './casilla/archivo/archivo.component';
import { JuridicaComponent } from './usuarios/registro/juridica/juridica.component';
import { NaturalComponent } from './usuarios/registro/natural/natural.component';
import { InformacionBasicaComponent } from './shared/informacion-basica/informacion-basica.component';
import { SeguimientoComponent } from './reportes/seguimiento/seguimiento.component';
import { CabeceraComponent } from './shared/cabecera/cabecera.component';
import { RepresentanteLegalComponent } from './expediente/representante-legal/representante-legal.component';
import { RegistroRepresentanteComponent } from './expediente/representante-legal/registro-representante/registro-representante.component';
import { RecuperaComponent } from './usuarios/recupera/recupera.component';
import { MenuComponent } from './usuarios/menu/menu.component';
import { CacheInterceptor } from './usuarios/interceptors/cache.interceptor';
registerLocaleData(localeES, 'es');
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    BandejaComponent,
    ModalTerminosComponent,
    FilterPipe,
    ExpedientePipe,
    ConsultaComponent,
    EdicionComponent,
    NuevoRegistroComponent,
    PersonalEcodocComponent,
    FirmaDigitalComponent,
    CasillaComponent,
    ArchivoComponent,
    JuridicaComponent,
    NaturalComponent,
    InformacionBasicaComponent,
    SeguimientoComponent,
    CabeceraComponent,
    RepresentanteLegalComponent,
    RegistroRepresentanteComponent,
    RecuperaComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxDatatableModule,
    NgxSpinnerModule,
    FontAwesomeModule,
    NgxPaginationModule,
    MatDatepickerModule,
    MatMomentDateModule,
    ModalModule.forRoot(),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SphttpInterceptor, multi: true },
    /* { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }, */
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
