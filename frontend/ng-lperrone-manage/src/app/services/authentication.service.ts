import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public currentUser: Observable<User>;
  public isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private currentUserSubject: BehaviorSubject<User>;

  constructor(private http: HttpClient) {
    // this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();


  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email, password) {
    return from(this.http.post<any>(`${environment.apiBaseUrl}/api/v1/users/login`, {email, password})).pipe(map(res => {
      const {data, token} = res;
      const user = new User();
      user._id = data.user._id;
      user.email = data.user.email;
      user.token = token;
      if (data && data.user && token) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isLoggedIn.next(true);
      } else {
        return false;
      }
      return user;
    }));
  }

  logout() {
    this.isLoggedIn.next(false);
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    return from(this.http.get(`${environment.apiBaseUrl}/api/v1/users/logout`));
  }

  public getToken(): string {
    return localStorage.getItem('currentUser') ?  JSON.parse(localStorage.getItem('currentUser'))['token'] : null;
  }
}
