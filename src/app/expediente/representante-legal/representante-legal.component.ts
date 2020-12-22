import { Component, OnInit } from '@angular/core';
import { RegistroExpedienteService } from '../nuevo-registro/registro-expediente.service';
import { Ciudadano } from '../../model/ciudadano.model';
import { AuthService } from '../../usuarios/service/auth.service';
import { Usuario } from '../../model/usuario.model';
@Component({
  selector: 'app-representante-legal',
  templateUrl: './representante-legal.component.html',
  styleUrls: ['./representante-legal.component.css']
})
export class RepresentanteLegalComponent implements OnInit {
  representantes: Ciudadano[];
  usuario: Usuario;
  constructor(private registroExpedienteService: RegistroExpedienteService, private authService: AuthService,) { }

  ngOnInit(): void {
    this.usuario = this.authService.usuario;
    this.registroExpedienteService.getRepresentanteLegal(this.usuario.idCiudadano).subscribe((response) => {
      console.log(response)
      if (response) {
        this.representantes = response;
      }

    });
  }

}
