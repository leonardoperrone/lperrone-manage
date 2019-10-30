import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SkillsComponent } from './pages/skills/skills.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SvgViewerComponent } from './commons/svg-viewer/svg-viewer.component';
import { EditModalComponent } from './components/edit-modal/edit-modal.component';
import { LoginComponent } from './pages/login/login.component';
import { TechnologyDetailComponent } from './components/technology-detail/technology-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './services/auth.guard';
import { ProjectsComponent } from './pages/projects/projects.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { TokenInterceptor } from './commons/tokenInterceptor';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    SkillsComponent,
    TechnologyDetailComponent,
    SvgViewerComponent,
    EditModalComponent,
    LoginComponent,
    ProjectsComponent,
    FileUploadComponent,
    ProjectDetailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
