import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthenticationService } from '../../services/authentication.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent implements OnInit{
  public pageTitle = "{faiton;codes}"
  private _snackBar = inject(MatSnackBar);

  #AuthService = inject(AuthenticationService);

  #fb = inject(FormBuilder);

  public loginForm = this.#fb.group({
    email: ['', Validators.email],
    password: ['',  Validators.required]
  });

  ngOnInit(): void {

    if (this.#AuthService.isLoggedIn() && !this.#AuthService.isTokenExpired()){

      this.#AuthService.redirect();
    }
  }
 

  public onSubmit(){

    if (this.loginForm.valid){
     
      this.#AuthService.loginUser(this.loginForm.value.email!, this.loginForm.value.password!);
  
    }else{

      this._snackBar.open("Certifique-se de preencher todos os campos!", "Fechar", {
        duration: 2500
      });  
    }

    if (!this.loginForm.get("email")?.valid){

      this._snackBar.open("E-mail Inválido!!", "Fechar", {
        duration: 2500
      });
    }

  }

}
