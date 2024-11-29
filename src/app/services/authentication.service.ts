import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthenticationClient } from '../client/authentication.client';

// Teste Token JWT
import { JwtHelperService } from '@auth0/angular-jwt';

// Toast
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private tokenKey = 'token';
  private tipoUsuario = 'tipoUsuario';
  private userColor = 'color';

  #jwtTokenHandler = new JwtHelperService();
  #messageService = inject(MessageService);

  constructor( 
    private authenticationClient: AuthenticationClient,
    private router: Router
  ) { }


  
  public registerUser(nome: string, password: string, email: string, tipoUsuario: number) {

    this.authenticationClient.register(nome, password, email, tipoUsuario).subscribe({
      next: (next) =>  {
        this.#messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Registro efetuado com sucesso!' });
        setTimeout(
          () => this.router.navigate(['/login']), 3000
        )
      }
    });

  }

  
  public loginUser(email: string, password: string) {

    this.authenticationClient.login(email, password).subscribe({
      next: (next) => {
        localStorage.setItem(this.tokenKey, next.token);
        localStorage.setItem(this.tipoUsuario, next.tipoUsuario);
        localStorage.setItem(this.userColor, next.userColor);
        this.router.navigate(['/']);
      }
    });
  }

  public logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tipoUsuario);
    localStorage.removeItem(this.userColor);
    this.router.navigate(['/login']);
  }

  public isLoggedIn(): boolean {

    let token = localStorage.getItem(this.tokenKey);
    return token != null && token.length > 0;
  }

  public getToken(): string | null {
    return this.isLoggedIn() ? localStorage.getItem(this.tokenKey) : null;
  }

  public getTipoUsuario(): string | null {
    return this.isLoggedIn() ? localStorage.getItem(this.tipoUsuario) : null;
  }

  public getUserColor(): string | null {
    return this.isLoggedIn() ? localStorage.getItem(this.userColor) : null;
  }

  public isTokenExpired(){ // Verifica se o Token é válido

    return this.#jwtTokenHandler.isTokenExpired(this.getToken()!);
  }

  public getTokenDecoded(){ // Retorna dados do Token Decodificados

    return this.#jwtTokenHandler.decodeToken(this.getToken()!);
  }

  public redirect(){

    this.router.navigate(['/not-found']);
  }

}
