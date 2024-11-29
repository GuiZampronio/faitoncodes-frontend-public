import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

// Rxjs
import { catchError, Observable, shareReplay, tap, throwError } from 'rxjs';

import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CoreProcessorService {

  constructor( private http: HttpClient ) { }

  #url = signal(environment.apiCore);
  #messageService = inject(MessageService);

  // Inicio Get Turmas

  #setClassList = signal<any | null>(null);
  get getClassList() {
    return this.#setClassList.asReadonly();
  }

  #setClassListError = signal<any | null>(null);
  get getClassListError() {
    return this.#setClassListError.asReadonly();
  }

  public httpClassList(token : string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.#setClassList.set(null);
    this.#setClassListError.set(null);

    return this.http.get<any>(
      this.#url() + '/class/getClasses', { headers }).pipe(
      tap((res) => this.#setClassList.set(res)),
      catchError((error: HttpErrorResponse) => {
        this.#setClassListError.set(error.error.message);
        return throwError(() => error);
      })
    );
  }

  // Fim Get Turma

  // Inicio Post Join Turma (Entrar em uma classe)

  public httpClassLink(token : string, classCode : string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('classCode', `${classCode}`);

    return this.http.post<any>(
      this.#url() + '/class/linkClass', null, { headers, params }).pipe(
      shareReplay(),
      catchError((error: HttpErrorResponse) => {
        this.#messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message});
        return throwError(() => error);
      })
    );
  }

  // Fim Post Join Turma

  // Inicio Get Turma por ID (página principal da turma)

  #setClassId = signal<any | null>(null);
  get getClassId() {
    return this.#setClassId.asReadonly();
  }

  #setClassIdError = signal<any | null>(null);
  get getClassIdError() {
    return this.#setClassIdError.asReadonly();
  }

  public httpClassId(token : string, classId : string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('classId', `${classId}`);

    this.#setClassId.set(null);
    this.#setClassIdError.set(null);

    return this.http.get<any>(
      this.#url() + '/class/getClass', { headers, params }).pipe(
      tap((res) => {
        this.#setClassId.set(res);
        this.httpExerciseList(token, classId).subscribe(); // Se puxar a turma com sucesso, puxa os exercícios dela
      }),
      catchError((error: HttpErrorResponse) => {
        this.#setClassIdError.set(error.error.message);
        return throwError(() => error);
      })
    );
  }

  // Fim Get Turma por ID (página principal da turma)

  // Inicio Post Create Turma (Criar uma classe)

  public httpCreateClass(token : string, className : string, announcement : string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(
      this.#url() + '/class/createClass', 
      {
        className: className,
        announcement: announcement
      }, { headers }).pipe(
      tap((res) => this.#messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Registro efetuado com sucesso! Código Turma: ' + res.classCode})),
      shareReplay(),
      catchError((error: HttpErrorResponse) => {
        this.#messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message});
        return throwError(() => error);
      })
    );
  }

  // Fim Post Create Turma

  // Inicio Put Edit Turma (Editar uma classe)

  public httpEditClass(token : string, className : string, announcement : string, classId : string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('classId', `${classId}`);

    return this.http.put<any>(
      this.#url() + '/class/editClass', 
      {
        className: className,
        announcement: announcement
      }, { headers, params }).pipe(
      shareReplay(),
      catchError((error: HttpErrorResponse) => {
        this.#messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message});
        return throwError(() => error);
      })
    );
  }

  // Fim Put Edit Turma

  // Inicio Get Exercicios da Turma

  #setExerciseList = signal<any | null>(null);
  get getExerciseList() {
    return this.#setExerciseList.asReadonly();
  }
 
  #setExerciseListError = signal<any | null>(null);
  get getExerciseListError() {
    return this.#setExerciseListError.asReadonly();
  }
 
  public httpExerciseList(token : string, classId : string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('classId', `${classId}`);

    this.#setExerciseList.set(null);
    this.#setExerciseListError.set(null);
 
    return this.http.get<any>(
      this.#url() + '/exercise/getExercisesFromClass', { headers, params }).pipe(
      tap((res) => this.#setExerciseList.set(res)),
      catchError((error: HttpErrorResponse) => {
        this.#setExerciseListError.set(error.error.message);
        return throwError(() => error);
      })
    );
  }
 
  // Fim Get Exercicios da Turma

  // Inicio Get Exercício por ID (página principal do Exercício)

  #setExerciseId = signal<any | null>(null);
  get getExerciseId() {
    return this.#setExerciseId.asReadonly();
  }

  #setExerciseIdError = signal<any | null>(null);
  get getExerciseIdError() {
    return this.#setExerciseIdError.asReadonly();
  }

  public httpExerciseId(token : string, exerciseId : string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('exerciseId', `${exerciseId}`);

    this.#setExerciseId.set(null);
    this.#setExerciseIdError.set(null);

    return this.http.get<any>(
      this.#url() + '/exercise/getExerciseFromClass', { headers, params }).pipe(
      tap((res) => {
        this.#setExerciseId.set(res);
        this.httpSubmissionId(token, exerciseId).subscribe();
      }),
      catchError((error: HttpErrorResponse) => {
        this.#setExerciseIdError.set(error.error.message);
        return throwError(() => error);
      })
    );
  }

  // Fim Get Exercício por ID (página principal do Exercício)

  // Inicio Post Create Exercício (Criar um exercício)

  public httpCreateExercise(token : string, classId : number, title : string, description : string, testCases : string, dueDate : string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(
      this.#url() + '/exercise/createExercise', 
      {
        classId: classId,
        title: title,
        description: description,
        testCases: testCases,
        dueDate: dueDate
      }, { headers }).pipe(
      tap((res) => this.#messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Exercício criado com sucesso!'})),
      shareReplay(),
      catchError((error: HttpErrorResponse) => {
        this.#messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message});
        return throwError(() => error);
      })
    );
  }

  // Fim Post Post Create Exercício

  // Inicio Put Exercício (Editar um exercício)

  public httpUpdateExercise(token : string, exerciseId: number, classId : number, title : string, description : string, testCases : string, dueDate : string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('exerciseId', `${exerciseId}`);

    return this.http.put<any>(
      this.#url() + '/exercise/updateExercise', 
      {
        classId: classId,
        title: title,
        description: description,
        testCases: testCases,
        dueDate: dueDate
      }, { headers, params }).pipe(
      shareReplay(),
      catchError((error: HttpErrorResponse) => {
        this.#messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message});
        return throwError(() => error);
      })
    );
  }

  // Fim Put Exercício

  //Inicio Post Submit Code

  public httpSubmitCode(token: string, exerciseId: number, studentCode: string): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(
      this.#url() + '/exerciseSubmission/submitCode', 
      {
        exerciseId: exerciseId,
        codeSent: studentCode,
      }, { headers }).pipe(
      tap((res) => {
        this.#messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Submissão concluída!'})
        this.httpSubmissionId(token, exerciseId.toString()).subscribe();
      }),
      shareReplay(),
      catchError((error: HttpErrorResponse) => {
        this.#messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message});
        return throwError(() => error);
      })
    );
  }

  // Fim Post Submission Code


  // Inicio Get Submissão por ID (página principal do Exercício)

  #setSubmissionId = signal<any | null>(null);
  get getSubmissionId() {
    return this.#setSubmissionId.asReadonly();
  }
  
  #setSubmissionIdError = signal<any | null>(null);
  get getSubmissionIdError() {
    return this.#setSubmissionIdError.asReadonly();
  }
  
   public httpSubmissionId(token : string, exerciseId : string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('exerciseId', `${exerciseId}`);
  
    this.#setSubmissionId.set(null);
    this.#setSubmissionIdError.set(null);
  
    return this.http.get<any>(
      this.#url() + '/exerciseSubmission/retrieveSubmission', { headers, params }).pipe(
      tap((res) => {
        this.#setSubmissionId.set(res);
      }),
      catchError((error: HttpErrorResponse) => {
        this.#setSubmissionIdError.set(error.error.message);
        return throwError(() => error);
      })
    );
  }
  
  // Fim Get Submissão por ID (página principal do Exercício)

  // Inicio Get Submissão por ID (página principal do Exercício)

  #setSubmissionList = signal<any | null>(null);
  get getSubmissionList() {
    return this.#setSubmissionList.asReadonly();
  }
    
  #setSubmissionListError = signal<any | null>(null);
  get getSubmissionListError() {
    return this.#setSubmissionListError.asReadonly();
  }
    
  public httpSubmissionList(token : string, exerciseId : string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('exerciseId', `${exerciseId}`);
    
    this.#setSubmissionList.set(null);
    this.#setSubmissionListError.set(null);
    
    return this.http.get<any>(
      this.#url() + '/exerciseSubmission/retrieveSubmissions', { headers, params }).pipe(
      tap((res) => {
        this.#setSubmissionList.set(res);
      }),
      catchError((error: HttpErrorResponse) => {
        this.#setSubmissionListError.set(error.error.message);
        return throwError(() => error);
      })
    );
  }
    
  // Fim Get Submissão por ID (página principal do Exercício)

}