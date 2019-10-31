import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) {
  }

  getProjects(): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/api/v1/projects`);
  }

  createProject(value): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/api/v1/projects`, value, {
      reportProgress: true,
      observe: 'events'
    });
  }

  updateProject(projectId: string, value: any): Observable<any> {
    return this.http.patch(`${environment.apiBaseUrl}/api/v1/projects/${projectId}`, value, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteProject(projectId: string): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/api/v1/projects/${projectId}`);
  }

  deleteLogo(projectId: string, logoIndex: number): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/api/v1/projects/${projectId}/logo/${logoIndex}`);
  }

  deletePicture(projectId: string, picIndex: number): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/api/v1/projects/${projectId}/picture/${picIndex}`);
  }
}
