import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Technology } from '../models/Technology';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {

  constructor(private http: HttpClient) { }
  
  getTechnologies(): Observable<any> {
    return from(this.http.get('http://127.0.0.1:3000/api/v1/technologies'));
  }
}
