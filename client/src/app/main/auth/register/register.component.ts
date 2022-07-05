import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginResponse } from "src/app/core/models/http-models/loginResponse";
import { AuthService } from "src/app/core/services/auth.service";
import * as moment from "moment";
import { isEmailAvailable } from "src/app/core/validators/email-validator";
import { UserService } from "src/app/core/services/user.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;

  uploadFile: any;

  errorMessage: string = "";

  constructor(private authService: AuthService, private router: Router) {
    this.registerForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  ngOnInit(): void {}

  get email() {
    return this.registerForm.get("email")! as FormControl;
  }

  get password() {
    return this.registerForm.get("password")! as FormControl;
  }

  public setFile(event: any): void {
    for (const file of event.files) {
      this.errorMessage = "";
      this.uploadFile = file;
    }
  }

  public clearFile(): void {
    this.uploadFile = null;
    this.errorMessage = "File is required";
  }

  public register(): void {
    if (!this.uploadFile) {
      this.errorMessage = "File is required";
    } else {
      this.errorMessage = "";
      const registerData = new FormData();

      Object.keys(this.registerForm.controls).forEach((key: string) => {
        const formControl = this.registerForm.get(key);
        if (formControl?.value) {
          registerData.append(key, formControl.value);
        }
      });

      if (this.uploadFile) {
        registerData.append("picture", this.uploadFile);
      }

      this.authService
        .register(registerData)
        .subscribe((data: LoginResponse) => {
          this.router.navigate(["board"]);
        });
    }
  }
}
