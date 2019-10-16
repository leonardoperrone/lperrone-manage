import { map } from 'rxjs/operators';

import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthenticationService, private router: Router){}
    
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ): Observable<boolean> {
        return this.authService.isUserLoggedIn().pipe(map(value => {
            if(value) {
                this.router.navigate(['/login'])
            }
            
            return value
        }));
      }
    
    // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        
    // //  return this.authService.isUserLoggedIn().pipe(map(res => res.isLoggedIn)).take(1)
    // console.log(this.authService.isUserLoggedIn())
    // return this.authService.isUserLoggedIn()
}
