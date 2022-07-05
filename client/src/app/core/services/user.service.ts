import { IsEmailAvailableResponse } from './../models/http-models/isEmailAvailableResponse';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/core/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  public getUserList(): Observable<User[]> {
    return this.http.get<User[]>(`user`).pipe(map((userList: User[]) => userList));
  }

  public createUser(userBody: User): Observable<User> {
    return this.http.post<User>(`user`, userBody).pipe(map((user: User) => user));
  }

  public getUser(id: number): Observable<User> {
    return this.http.get<User>(`user/${id}`).pipe(map((user: User) => user));
  }

  public updateUser(userBody: User): Observable<User> {
    return this.http.put<User>(`user/${userBody.id}`, userBody).pipe(map((user: User) => user));
  }

  public removeUser(id: number): Observable<User> {
    return this.http.delete<User>(`user/${id}`).pipe(map((user: User) => user));
  }

  public isEmailAvailable(email: string): Observable<IsEmailAvailableResponse> {
    return this.http
      .post<IsEmailAvailableResponse>(`user/is-email-available`, email)
      .pipe(map((response: IsEmailAvailableResponse) => response));
  }
}
