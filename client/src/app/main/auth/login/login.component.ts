import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponse } from 'src/app/core/models/http-models/loginResponse';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {}

  get email() {
    return this.loginForm.get('email')! as FormControl;
  }

  get password() {
    return this.loginForm.get('password')! as FormControl;
  }

  public login(): void {
    this.authService.login(this.loginForm.getRawValue()).subscribe((data: LoginResponse) => {
      this.router.navigate(['board']);
    });
  }
}
