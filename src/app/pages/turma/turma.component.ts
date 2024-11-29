import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { CoreProcessorService } from '../../services/core-processor.service';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { DialogTurmasComponent } from '../dialog/dialog-turmas/dialog-turmas.component';
import { DialogExercisesComponent } from '../dialog/dialog-exercises/dialog-exercises.component';

@Component({
  selector: 'app-turma',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatMenuModule, MatButtonModule, RouterLink],
  templateUrl: './turma.component.html',
  styleUrl: './turma.component.css'
})
export default class TurmaComponent implements OnInit{

  #route = inject(ActivatedRoute);
  #dialog = inject(MatDialog);
  #AuthService = inject(AuthenticationService);
  #CoreService = inject(CoreProcessorService);

  userToken: any = "";
  decodedData: any = "";

  tipoUsuario: any = "";
  turmaDialog: any = "";
  exerciseDialog: any = "";

  userFirstLetter: string = "";
  userColor: any = "";

  public getClassId = this.#CoreService.getClassId;
  public getClassIdError = this.#CoreService.getClassIdError;

  public getExerciseList = this.#CoreService.getExerciseList;
  public getExerciseListError = this.#CoreService.getExerciseListError;

  ngOnInit(): void {

    this.userToken = this.#AuthService.getToken();
    this.decodedData = this.#AuthService.getTokenDecoded();
    this.tipoUsuario = this.#AuthService.getTipoUsuario();

    this.userFirstLetter = this.decodedData.nomeUsuario.substring(0, 1).toUpperCase();
    this.userColor = this.#AuthService.getUserColor();
    
    // Chamada da API
    this.#CoreService.httpClassId(this.userToken, this.#route.snapshot.params['id']).subscribe();

  }

  public logOff(){

    this.#AuthService.logout();
  }


  public openDialog() {

    this.turmaDialog = {
      title: 'Editar a turma',
      className: this.getClassId().className,
      classCode: this.getClassId().classCode,
      classId: this.getClassId().classId,
      announcement: this.getClassId().announcement,
      loginType: this.tipoUsuario,
      edit: 1,
      bottomText: 'Compartilhe esse código para que os alunos possam acessar'
    }

    this.#dialog.open(DialogTurmasComponent, {
      data: this.turmaDialog,
      panelClass: 'dialog-turmas-component',
    });


  }

  public openExerciseDialog() {

    this.exerciseDialog = {
      title: 'Adicionar um Exercício',
      classId: this.getClassId().classId
    }

    this.#dialog.open(DialogExercisesComponent, {
      data: this.exerciseDialog,
      panelClass: 'dialog-exercises-component',
    });
  }

}
