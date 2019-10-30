import { Component, OnInit } from '@angular/core';
import { TechnologyService } from 'src/app/services/technology.service';
import { Technology } from 'src/app/models/Technology';

@Component({
  selector: 'app-home',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  public technologies: Technology[];
  public loaded = false;
  public indexes = new Map();
  public nextIndex = 0;

  constructor(private technologyService: TechnologyService) {
  }

  ngOnInit() {
    // TODO: fix this way of finding next available index,
    //  this is faulty, need to add index to map with 0 or 1
    this.technologyService.getTechnologies().subscribe(res => {
      // TODO: refactor, duplicate of projects
      this.technologies = res.data.docs.map((doc, idx) => {
        this.indexes.set(doc.orderIndex, 1);
        this.nextIndex = this.indexes.get(idx) > 0 ? idx + 1 : idx;
        return doc;
      });
      if (this.technologies) {
        this.loaded = true;
      }
    });
  }

}
