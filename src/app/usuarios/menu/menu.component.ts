import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { Menu } from 'src/app/model/menu.model';
import { AuthService } from '../../usuarios/service/auth.service';
import { faArchive, faBook, faBoxOpen, faEdit, faFilePdf, faAddressBook } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menus: Menu[];
  faArchive = faArchive;
  faBook = faBook;
  faBoxOpen = faBoxOpen;
  faEdit = faEdit;
  faFilePdf = faFilePdf;
  faAddressBook = faAddressBook;
  accion = '/bandejaElectronica';
  constructor( public authService: AuthService, public router: Router, private cdRef:ChangeDetectorRef) { }

  ngOnInit(): void {
      const usuario = this.authService.usuario;
      this.authService
      .getMenu(usuario.idUsuario)
      .subscribe((menu) => {
        console.log(menu.length);
        if(menu.length===0){
          this.authService.logout();
          this.router.navigate(['/login']);
          swal.fire(
            'Aviso',
            'Es usuario MINAM, pero aun no se ha asignado el perfil!',
            'warning'
          );
        }
        this.menus = menu;
      });
    this.authService.menu$.subscribe(menu => {
        this.accion = menu;
        this.cdRef.detectChanges();
    });
  }
 
}
