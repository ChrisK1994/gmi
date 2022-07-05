import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { BehaviorSubject, Observable, of, timer } from "rxjs";
import { environment } from "../../../environments/environment";
import { map, switchMap, tap, shareReplay, catchError } from "rxjs/operators";
import { PersistanceService } from "./persistance.service";
import { Router } from "@angular/router";

import { User } from "./../models/user";
import { LoginResponse } from "./../models/http-models/loginResponse";
import { RegisterRequest } from "./../models/http-models/registerRequest";
import { LoginRequest } from "./../models/http-models/loginRequest";
import { Token } from "../models/token";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  readonly apiUrl;
  private readonly JWT_TOKEN = "JWT_TOKEN";
  private readonly REFRESH_TOKEN = "REFRESH_TOKEN";
  private readonly USER_DATA = "USER_DATA";

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private localStore: PersistanceService
  ) {
    this.apiUrl = environment.apiUrl;
  }

  public login(loginData: LoginRequest): Observable<LoginResponse> {
    return this.httpClient
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, loginData)
      .pipe(
        tap((response: LoginResponse) =>
          this.doLoginUser(response?.data?.user, response?.data?.token)
        ),
        map((res) => {
          return res;
        })
      );
  }

  public register(registerData: FormData): Observable<LoginResponse> {
    return this.httpClient
      .post<LoginResponse>(`${this.apiUrl}/auth/register`, registerData)
      .pipe(
        tap((response: LoginResponse) =>
          this.doLoginUser(response?.data?.user, response?.data?.token)
        ),
        map((res: LoginResponse) => res)
      );
  }

  public logout(): void {
    this.doLogoutUser();
  }

  public isLoggedIn(): boolean {
    return !!this.getJwtToken();
  }

  public refreshToken(): Observable<Token> {
    return this.httpClient
      .post<Token>(`auth/refresh-token`, {
        email: this.getUserData().email,
        refreshToken: this.getRefreshToken(),
      })
      .pipe(
        tap((tokens) => {
          this.storeTokens(tokens);
        })
      );
  }

  public getJwtToken(): string {
    return this.localStore.get(this.JWT_TOKEN);
  }

  public get currentUser(): User {
    return this.getUserData();
  }

  private doLoginUser(user: User, token: Token): void {
    this.storeUserData(user);
    this.storeTokens(token);
  }

  private doLogoutUser(): void {
    this.removeUserData();
    this.removeTokens();
    this.router.navigate(["auth/login"]);
  }

  private getUserData(): User {
    return this.localStore.get(this.USER_DATA);
  }

  private storeUserData(user: User): void {
    this.localStore.set(this.USER_DATA, user);
  }

  private removeUserData(): void {
    this.localStore.remove(this.USER_DATA);
  }

  private getRefreshToken(): string {
    return this.localStore.get(this.REFRESH_TOKEN);
  }

  private storeTokens(token: Token): void {
    this.localStore.set(this.JWT_TOKEN, token.accessToken);
    this.localStore.set(this.REFRESH_TOKEN, token.refreshToken);
  }

  private removeTokens(): void {
    this.localStore.remove(this.JWT_TOKEN);
    this.localStore.remove(this.REFRESH_TOKEN);
  }
}
