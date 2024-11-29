import { CanMatchFn } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';

export const canMatchGuard: CanMatchFn = (route, segments) => {

  const AuthService = inject(AuthenticationService);

  if (AuthService.isLoggedIn()){

    //console.log("Entrou no Logado");

    if(AuthService.isTokenExpired()){

      return false;
    }
  }else{

    //console.log("Entrou no Não logado");

    return false;
  }

  return true;

};
