import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  CanLoad,
  Route,
} from "@angular/router";
import { MessageService } from "primeng/api";
import { PrimeNGConfig } from "primeng/api";

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(
    public router: Router,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {
    this.primengConfig.ripple = true;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        console.log(error);
        if (error instanceof HttpErrorResponse) {
          if (error.error instanceof ErrorEvent) {
            console.error("Error Event");
          } else {
            console.log(`error status : ${error.message}`);
            if (error.error) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.message,
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.message,
              });
            }
          }
        } else {
          console.error("some thing else happened");
        }
        return throwError(error);
      })
    );
  }
}
