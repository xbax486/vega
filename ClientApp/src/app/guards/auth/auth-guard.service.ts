import { AuthService } from '../../services/auth/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(protected authService: AuthService) {}

    canActivate() {
        if(this.authService.isAuthenticated())
            return true;
        window.location.href = 'https://abvegaproject.au.auth0.com/login?client=76DJbnZYOVib159sRvgbc9W55ZrfEiAz';
        return false;
    }
}