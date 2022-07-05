import { IsEmailAvailableResponse } from './../models/http-models/isEmailAvailableResponse';
import { switchMap, map } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, timer } from 'rxjs';

export function isEmailAvailable(userService: UserService): AsyncValidatorFn {
  return (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(500).pipe(
      switchMap(() => userService.isEmailAvailable(ctrl.value)),
      map((res: IsEmailAvailableResponse) => {
        return res.isAvailable ? null : { emailTaken: true };
      })
    );
  };
}
