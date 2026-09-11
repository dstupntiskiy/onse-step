import { Component, inject, signal } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
@Component({selector:'app-login',standalone:true,imports:[FormsModule, ReactiveFormsModule],templateUrl:'./login.component.html',styleUrl:'./login.component.scss'})
export class LoginComponent {
 readonly user = inject(UserService);
 readonly router = inject(Router);
 readonly login = new FormControl('',{nonNullable:true,validators:[Validators.required]});
 readonly password = new FormControl('',{nonNullable:true,validators:[Validators.required]});
 readonly busy = signal(false);
 readonly error = signal('');
 readonly showPassword = signal(false);
 onLogin() {
  if (this.busy()) return;
  this.login.markAsTouched(); this.password.markAsTouched();
  if(this.login.invalid || this.password.invalid) return;
  this.busy.set(true); this.error.set('');
  this.user.login(this.login.value,this.password.value).pipe(finalize(() => this.busy.set(false))).subscribe({
    next: () => this.router.navigateByUrl('/'),
    error: () => this.error.set('Не удалось войти. Проверьте логин, пароль и доступность сервера.')
  });
 }
}
