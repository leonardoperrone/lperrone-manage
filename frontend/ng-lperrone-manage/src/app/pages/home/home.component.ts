import { Component, OnInit } from '@angular/core';
import { TechnologyService } from 'src/app/services/technology.service';
import { Technology } from 'src/app/models/Technology';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public technologies: Technology[];
  public loaded = false;

  constructor(private technologyService: TechnologyService) { }

  ngOnInit() {
    this.technologyService.getTechnologies().subscribe(res => {
      console.log(res);
      this.technologies = res.data.docs;
      if (this.technologies) {
        this.loaded=true;
      }
    })
  }

}
