import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { AUTH_CONFIG } from "./auth0-variables";
import { JwtHelperService } from "@auth0/angular-jwt";

(window as any).global = window;

@Injectable()
export class AuthService {
  profile: any = {};
  private roles: string[] = [];

  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: AUTH_CONFIG.responseType,
    audience: AUTH_CONFIG.audience,
    redirectUri: AUTH_CONFIG.redirectUri,
    scope: AUTH_CONFIG.scope
  });

  constructor(public router: Router) {
    this.handleAuthentication();
  }

  public login(): void {
    this.auth0.authorize();
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('profile');
    this.profile = null;
    this.roles = [];
    // Go back to the home route
    this.router.navigate(['']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((error, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.getProfile((error, profile) => {});
        this.router.navigate(['']);
      }
      else if (error) {
        this.router.navigate(['']);
      }
      else {
        this.readUserDetailsFromLocalStorage();
      }
    });
  }

  public getProfile(callback): void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }

    this.auth0.client.userInfo(accessToken, (error, profile) => {
      if (error) {
        throw error;
      }
      localStorage.setItem('profile', JSON.stringify(profile));
      this.readUserDetailsFromLocalStorage();
      callback(error, profile);
    });
  }

  public isInRole(role) {
    if(this.roles && this.roles.length > 0)
      return this.roles.indexOf(role) > -1;
    return false;
  }

  private setSession(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  private readUserDetailsFromLocalStorage() {
    this.profile = JSON.parse(localStorage.getItem('profile'));

    var id_token = localStorage.getItem('id_token');
    if (id_token) {
      var jwtHelper = new JwtHelperService();
      var decodedToken = jwtHelper.decodeToken(id_token);
      this.roles = decodedToken['https://abvega.com/roles'] || [];
    }
  }
}