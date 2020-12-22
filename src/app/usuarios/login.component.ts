import { Component, OnInit } from '@angular/core';
import { Usuario } from '../model/usuario.model';
import swal from 'sweetalert2';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';
import { faUserCircle, faLock } from '@fortawesome/free-solid-svg-icons';
import { AppConstants } from '../app.constants';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  titulo: string = 'Por favor Inicie Sesion!';
  usuario: Usuario;
  faUserCircle = faUserCircle;
  faLock = faLock;
  private environmentUrl = environment.apiUrlCeroPapel;
  srcManual: string;
  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      swal.fire(
        'Login',
        `Sr(a). ${this.authService.usuario.apellidos} ya esta autenticado!`,
        'info'
      );
      this.router.navigate(['/bandejaElectronica']);
    }
    this.srcManual =
        this.environmentUrl + '/assets/Manual_Tramite_Cero_Papel.pdf';
  }

  login(): void {
    console.log(this.usuario);
    if (this.usuario.username == null) {
      swal.fire(
        'Validación',
        'Por favor ingresar el número de documento',
        'warning'
      );
      return;
    } else if (this.usuario.password == null) {
      swal.fire('Validación', 'Por favor ingresar su contraseña', 'warning');
      return;
    }

    this.authService.login(this.usuario).subscribe(
      (response) => {
        console.log(response);

        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        let usuario = this.authService.usuario;
        console.log('LDAP' + this.authService.hasTipoLDAP());
        if (this.authService.hasTipoLDAP()) {
          this.router.navigate(['/reporte']);
        } else {
          this.router.navigate(['/bandejaElectronica']);
        }

        if (usuario.idTipoDocumento === AppConstants.ID_TIPO_DOCUMENTO_RUC) {
          swal.fire(
            'Login',
            `Sr. ${usuario.nombres}, Bienvenido al Sistema de Trámite Cero Papel`,
            'success'
          );
        } else {
          swal.fire(
            'Login',
            `Sr(a). ${usuario.apellidos}, Bienvenido al Sistema de Trámite Cero Papel`,
            'success'
          );
        }
      },
      (err) => {
        if (err.status == 400) {
          swal.fire('Login', 'Usuario o clave incorrectas!', 'warning');
        } else {
          swal.fire('Login', 'Ha surgido un problema, intente mas tarde', 'warning');
        }

      }
    );
  }
}
