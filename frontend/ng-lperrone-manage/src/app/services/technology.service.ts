import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {

  constructor(private http: HttpClient) {
  }

  getTechnologies(): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/api/v1/technologies`);
  }

  createTechnology(value) {
    return this.http.post(`${environment.apiBaseUrl}/api/v1/technologies`, value, {
      reportProgress: true,
      observe: 'events'
    });
  }

  updateTechnology(techId: string, value: any): Observable<any> {
    return this.http.patch(`${environment.apiBaseUrl}/api/v1/technologies/${techId}`, value, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteTechnology(techId: string): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/api/v1/technologies/${techId}`);
  }

  deleteLogo(techId: string, logoIndex: number): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/api/v1/technologies/${techId}/logo/${logoIndex}`);
  }
}
