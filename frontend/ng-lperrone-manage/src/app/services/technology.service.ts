import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {

  constructor(private http: HttpClient) {
  }

  getTechnologies(): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/api/v1/technologies');
  }

  createTechnology(value) {
    return this.http.post(`http://127.0.0.1:3000/api/v1/technologies`, value, {
      reportProgress: true,
      observe: 'events'
    });
  }

  updateTechnology(techId: string, value: any): Observable<any> {
    return this.http.patch(`http://127.0.0.1:3000/api/v1/technologies/${techId}`, value, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteTechnology(techId: string): Observable<any> {
    return this.http.delete(`http://127.0.0.1:3000/api/v1/technologies/${techId}`);
  }

  deleteLogo(techId: string, logoIndex: number): Observable<any> {
    return this.http.delete(`http://127.0.0.1:3000/api/v1/technologies/${techId}/logo/${logoIndex}`);
  }
}
