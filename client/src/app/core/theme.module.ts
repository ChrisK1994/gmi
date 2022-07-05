import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';

const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule];

const PRIME_MODULES = [
  RippleModule,
  MenuModule,
  MenubarModule,
  InputTextModule,
  ButtonModule,
  FileUploadModule,
  CardModule,
  SplitButtonModule,
  ToolbarModule,
  CheckboxModule,
  InputTextareaModule,
  ToastModule,
  ToggleButtonModule,
  PasswordModule,
  DividerModule
];

@NgModule({
  imports: [...BASE_MODULES, ...PRIME_MODULES],
  exports: [...BASE_MODULES, ...PRIME_MODULES]
})
export class ThemeModule {}
