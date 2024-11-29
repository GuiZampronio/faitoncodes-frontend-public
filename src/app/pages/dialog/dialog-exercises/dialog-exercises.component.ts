import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { CoreProcessorService } from '../../../services/core-processor.service';
import { concatMap } from 'rxjs';

// Toast
import { MessageService } from 'primeng/api';

import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dialog-exercises',
  standalone: true,
  imports: [MatDialogModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dialog-exercises.component.html',
  styleUrl: './dialog-exercises.component.css'
})
export class DialogExercisesComponent {

  dateTimeControl = new FormControl('');
  public exerciseTitle = "";
  public description = "";
  public testCases = "";
  public dueDate = "";

  
  userToken: any = "";
  classId: any = "";
  exerciseId = "";

  #AuthService = inject(AuthenticationService);
  #CoreService = inject(CoreProcessorService);
  #messageService = inject(MessageService);

  constructor(
    private _dialogRef: MatDialogRef<DialogExercisesComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) {}


  public getData = signal<any | null>(null);

  ngOnInit(): void {
    
    this.getData.set(this._data);
    this.userToken = this.#AuthService.getToken();

    this.exerciseId = this.getData()?.exerciseId;
    this.classId = this.getData()?.classId;
    
    this.exerciseTitle = this.getData()?.exerciseTitle;
    this.description = this.getData()?.description;
    this.testCases = this.getData()?.testCases;
    this.dueDate = this.getData()?.dueDate;

  }

  applyMask(event: any): void {
    let input = event.target.value.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
    let formatted = '';

    if (input.length > 0) formatted += input.substring(0, 4); // Ano
    if (input.length > 4) formatted += '-' + input.substring(4, 6); // Mês
    if (input.length > 6) formatted += '-' + input.substring(6, 8); // Dia
    if (input.length > 8) formatted += ' ' + input.substring(8, 10); // Hora
    if (input.length > 10) formatted += ':' + input.substring(10, 12); // Minuto

    this.dateTimeControl.setValue(formatted, { emitEvent: false });
  }


  public closeModal() {
    return this._dialogRef.close();
  }


  public createExercise(token : string, classId : string, title : string, description : string, testCases : string, dueDate : string){

    this.#CoreService
      .httpCreateExercise(token, parseInt(classId), title, description, testCases, dueDate)
      .pipe(concatMap(() => this.#CoreService.httpExerciseList(token, classId)))
      .subscribe();
    return this._dialogRef.close();  
  }

  public editExercise(token : string, exerciseId: string, classId : string, title : string, description : string, testCases : string, dueDate : string){

    this.#CoreService
      .httpUpdateExercise(token, parseInt(exerciseId), parseInt(classId), title, description, testCases, dueDate)
      .pipe(concatMap(() => this.#CoreService.httpExerciseId(token, exerciseId)))
      .subscribe({
        next: (next) => this.#messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alteração efetuada com sucesso!'})});
    return this._dialogRef.close();  
  }

}
