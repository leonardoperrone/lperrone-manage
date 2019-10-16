import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './pages/home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SvgViewerComponent } from './commons/svg-viewer/svg-viewer.component';
import { EditModalComponent } from './components/edit-modal/edit-modal.component';
import { LoginComponent } from './pages/login/login.component';
import { TechnologyDetailComponent } from './components/technology-detail/technology-detail.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TechnologyDetailComponent,
    SvgViewerComponent,
    EditModalComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
