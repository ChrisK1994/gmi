import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from './../../core/theme.module';
import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './register/register.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './login/login.component';
@NgModule({
  imports: [CommonModule, FormsModule, AuthRoutingModule, ThemeModule],
  declarations: [LoginComponent, AuthComponent, RegisterComponent]
})
export class AuthModule {}
