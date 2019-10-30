import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  public projects: Project[];
  public loaded = false;
  public indexes = new Map();
  public nextIndex = 0;

  constructor(private projectService: ProjectService) {
  }


  ngOnInit() {
    // TODO: fix this way of finding next available index,
    //  this is faulty need to add index to map with 0 or 1
    this.projectService.getProjects().subscribe(res => {
      // TODO: refactor, duplicate of technology

      this.projects = res.data.docs.map((doc, idx) => {
          this.indexes.set(doc.orderIndex, 1);
          this.nextIndex = this.indexes.get(idx) > 0 ? idx + 1 : idx;
          return doc;
      });

      if (this.projects) {
        this.loaded = true;
      }
    });
  }
}
