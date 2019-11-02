import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.token === this.authService.getToken()) {
      return true;
    }


    this.router.navigate(['/login']);
    return false;
  }

}
