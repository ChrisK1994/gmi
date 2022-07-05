import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './main/page-not-found/page-not-found.component';
import { ThemeModule } from './core/theme.module';
import { CoreModule } from './core/core.module';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    ThemeModule,
    ToastModule
  ],
  providers: [ToastModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
