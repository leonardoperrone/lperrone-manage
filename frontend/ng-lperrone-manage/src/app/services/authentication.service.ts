import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public currentUser: Observable<User>;
  public currentUserSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  private isLoggedIn = false;
  constructor(private http: HttpClient) {
    
   }

  login(email, password) {
    return from(this.http.post<any>('http://127.0.0.1:3000/api/v1/users/login', { email, password })).pipe(map(user => {
      this.isLoggedIn = true;
      this.currentUserSubject.next(true)
    }))
  }

  logout() {
    this.isLoggedIn = false;
    this.currentUserSubject.next(false)
    return from(this.http.get('http://127.0.0.1:3000/api/v1/users/logout'))
  }
  
  isUserLoggedIn() {
    // return await this.http.get('http://127.0.0.1:3000/api/v1/')
    return this.currentUserSubject;
  }
  
}
