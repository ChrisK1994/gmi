import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { httpInterceptorProviders } from './interceptors';

@NgModule({
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  exports: [RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  providers: [httpInterceptorProviders, MessageService, DialogService]
})
export class CoreModule {}
