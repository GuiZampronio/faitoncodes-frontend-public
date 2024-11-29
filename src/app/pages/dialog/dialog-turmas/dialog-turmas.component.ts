import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { CoreProcessorService } from '../../../services/core-processor.service';
import { concatMap } from 'rxjs';

// Toast
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dialog-turmas',
  standalone: true,
  imports: [MatDialogModule, FormsModule],
  templateUrl: './dialog-turmas.component.html',
  styleUrl: './dialog-turmas.component.css'
})
export class DialogTurmasComponent{

  public codTurma = ""
  public className = "";
  public announcement = "";
  
  userToken: any = "";
  classId: any = "";

  #AuthService = inject(AuthenticationService);
  #CoreService = inject(CoreProcessorService);
  #messageService = inject(MessageService);

  constructor(
    private _dialogRef: MatDialogRef<DialogTurmasComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) {}


  public getData = signal<any | null>(null);

  ngOnInit(): void {
    
    this.getData.set(this._data);
    this.userToken = this.#AuthService.getToken();
    this.classId = this.getData()?.classId;
    this.className = this.getData()?.className;
    this.announcement = this.getData()?.announcement;

  }


  public closeModal() {
    return this._dialogRef.close();
  }

  public linkClass(token : string, codTurma : string) {

    this.#CoreService
      .httpClassLink(token, codTurma)
      .pipe(concatMap(() => this.#CoreService.httpClassList(token)))
      .subscribe({
        next: (next) => this.#messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ingressão na classe realizada com sucesso!' })});
    return this._dialogRef.close();

  }

  public createClass(token : string, className : string, announcement : string){

    this.#CoreService
      .httpCreateClass(token, className, announcement)
      .pipe(concatMap(() => this.#CoreService.httpClassList(token)))
      .subscribe();
    return this._dialogRef.close();  
  }

  public editClass(token : string, className : string, announcement : string, classId : string){

    this.#CoreService
      .httpEditClass(token, className, announcement, classId)
      .pipe(concatMap(() => this.#CoreService.httpClassId(token, classId)))
      .subscribe({
        next: (next) => this.#messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alteração efetuada com sucesso!'})});
    return this._dialogRef.close();  
  }

}
