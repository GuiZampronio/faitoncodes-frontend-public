import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

// Rxjs
import { catchError, Observable, shareReplay, tap, throwError } from 'rxjs';

import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationClient {

  constructor( private http: HttpClient ) { }

  #url = signal(environment.apiAuth);
  #messageService = inject(MessageService);


  // Registro de Usuário

  public register(nome: string, password: string, email: string, tipoUsuario: number): Observable<any> {
    return this.http.post<string>(
      this.#url()  + '/auth/register', 
      {
        nome: nome,
        password: password,
        email: email,
        tipoUsuario: tipoUsuario
      }).pipe(
        shareReplay(),
        catchError((error: HttpErrorResponse) => {
          this.#messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message});
          return throwError(() => error);
        })
    );
  }


  // Login de Usuário

  public login(email: string, password: string): Observable<any> {
    return this.http.post<string>(
      this.#url()  + '/auth/login', 
      {
        email: email,
        password: password
      }).pipe(
        shareReplay(),
        catchError((error: HttpErrorResponse) => {
          this.#messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message});
          return throwError(() => error);
        })
    );
  }

}
