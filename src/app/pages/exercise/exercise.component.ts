import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { CoreProcessorService } from '../../services/core-processor.service';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { DialogTurmasComponent } from '../dialog/dialog-turmas/dialog-turmas.component';
import { DialogExercisesComponent } from '../dialog/dialog-exercises/dialog-exercises.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms"
import { finalize } from 'rxjs';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatMenuModule, MatButtonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.css'
})
export default class ExerciseComponent implements OnInit{
 
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

  selectedFile!: File;
  allowButton: boolean = false;

  public getExerciseId = this.#CoreService.getExerciseId;
  public getExerciseIdError = this.#CoreService.getExerciseIdError;

  public getSubmissionId = this.#CoreService.getSubmissionId;
  public getSubmissionIdError = this.#CoreService.getSubmissionIdError;

  public getSubmissionList = this.#CoreService.getSubmissionList;
  public getSubmissionListError = this.#CoreService.getSubmissionListError;

  ngOnInit(): void {

    this.userToken = this.#AuthService.getToken();
    this.decodedData = this.#AuthService.getTokenDecoded();
    this.tipoUsuario = this.#AuthService.getTipoUsuario();

    this.userFirstLetter = this.decodedData.nomeUsuario.substring(0, 1).toUpperCase();
    this.userColor = this.#AuthService.getUserColor();
    
    // Chamada da API
    this.#CoreService.httpExerciseId(this.userToken, this.#route.snapshot.params['id']).subscribe();

    if (this.tipoUsuario == 2){

      // Chamada da API de submissões
      this.#CoreService.httpSubmissionList(this.userToken, this.#route.snapshot.params['id']).subscribe();  
    }

  }


  public logOff(){

    this.#AuthService.logout();
  }

  public openExerciseDialog() {

    this.exerciseDialog = {
      title: 'Editar Exercício',
      exerciseId: this.getExerciseId().id,
      classId: this.getExerciseId().classId,
      exerciseTitle: this.getExerciseId().title,
      description: this.getExerciseId().description,
      testCases: this.getExerciseId().testCases,
      dueDate: this.getExerciseId().dueDate,
      edit: 1
    }

    this.#dialog.open(DialogExercisesComponent, {
      data: this.exerciseDialog,
      panelClass: 'dialog-exercises-component',
    });
  }

  onFileSelected(event: any): void{
    const fileList: FileList = event.target.files;
    if(fileList && fileList.length > 0){
      this.selectedFile = fileList[0];
      this.allowButton = true;
    }else{
      this.allowButton = false;
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.allowButton = false;
      const fileReader = new FileReader();
  
      fileReader.onload = (event: ProgressEvent<FileReader>) => {
        
        const fileContent = event.target?.result as string;
        const studentCode = fileContent;

        this.#CoreService.httpSubmitCode(this.userToken, this.#route.snapshot.params['id'], studentCode).subscribe(() => {this.allowButton = true});
      };
  
      fileReader.onerror = (error) => {
        console.error('Erro ao ler o arquivo:', error);
        this.allowButton = false;
      };
  
      fileReader.readAsText(this.selectedFile); // Ler o arquivo como texto
    } else {
      console.error('Nenhum arquivo foi selecionado.');
      this.allowButton = false;
    }
  }

}
