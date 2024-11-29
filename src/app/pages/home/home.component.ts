import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { RouterLink } from '@angular/router';
import { CoreProcessorService } from '../../services/core-processor.service';

// Material
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';


// Dialog
import { DialogTurmasComponent } from '../dialog/dialog-turmas/dialog-turmas.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatMenuModule, MatButtonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export default class HomeComponent implements OnInit{

  #dialog = inject(MatDialog);
  #AuthService = inject(AuthenticationService);
  #CoreService = inject(CoreProcessorService);

  // Variaveis para consumir API e settar dados na tela
  userToken: any = "";
  decodedData: any = "";

  emailUser = "";
  tipoUsuario: any = "";
  turmaDialog: any = "";

  userFirstLetter: string = "";
  userColor: any = "";

  public getClassList = this.#CoreService.getClassList;
  public getClassListError = this.#CoreService.getClassListError;
  
  ngOnInit(): void {
  
    this.userToken = this.#AuthService.getToken();
    this.decodedData = this.#AuthService.getTokenDecoded();

    this.userFirstLetter = this.decodedData.nomeUsuario.substring(0, 1).toUpperCase();
    this.userColor = this.#AuthService.getUserColor();

    // Chamada da API
    this.#CoreService.httpClassList(this.userToken).subscribe();

  }


  public logOff(){

    this.#AuthService.logout();
  }

  
  public openDialog() {

    this.emailUser = this.decodedData.sub;
    this.tipoUsuario = this.#AuthService.getTipoUsuario();

    if (this.tipoUsuario == 1){

      this.turmaDialog = {
        title: 'Participar da turma',
        email: this.emailUser,
        loginType: this.tipoUsuario
      }
    }else{

      this.turmaDialog = {
        title: 'Criar uma nova turma',
        loginType: this.tipoUsuario,
        bottomText: 'O código da turma será gerado após a criação da sala'
      }
    }

    this.#dialog.open(DialogTurmasComponent, {
      data: this.turmaDialog,
      panelClass: 'dialog-turmas-component',
    });
  }
}
