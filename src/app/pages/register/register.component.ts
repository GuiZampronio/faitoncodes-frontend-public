import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export default class RegisterComponent{
  public pageTitle = "{faiton;codes}";
  private _snackBar = inject(MatSnackBar);

  #AuthService = inject(AuthenticationService);

  // Reactive Form
  #fb = inject(FormBuilder);

  public registerForm = this.#fb.group({
    nome: ['', Validators.required],
    password: ['',  Validators.required],
    passwordRpt: ['',  Validators.required],
    email: ['', Validators.email],
    tipoUsuario: ["1",  Validators.required],
    termosUso: [false, Validators.requiredTrue]
  });


  public onSubmit(){

    if (this.registerForm.valid && this.registerForm.value.password == this.registerForm.value.passwordRpt){
     
      this.#AuthService.registerUser(this.registerForm.value.nome!, this.registerForm.value.password!, this.registerForm.value.email!, parseInt(this.registerForm.value.tipoUsuario!));

    }else{

      this._snackBar.open("Certifique-se de preencher todos os campos!", "Fechar", {
        duration: 2500
      });  
    }

    if (!this.registerForm.get("termosUso")?.valid){

      this._snackBar.open("Necessário confirmar leitura dos termos de uso!", "Fechar", {
        duration: 2500
      });
    }

    if (this.registerForm.value.password != this.registerForm.value.passwordRpt){
      
      this._snackBar.open("Senhas digitadas não conferem!!", "Fechar", {
        duration: 2500
      });
    }

    if (!this.registerForm.get("email")?.valid){

      this._snackBar.open("E-mail Inválido!!", "Fechar", {
        duration: 2500
      });
    }

  }

}
