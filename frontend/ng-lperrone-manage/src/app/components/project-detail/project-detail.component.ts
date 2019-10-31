import { Component, Input, OnInit } from '@angular/core';
import { ModalTypes } from '../../enums/modal-types.enum';
import { Project } from '../../models/project';
import { ProjectService } from '../../services/project.service';
import { state, style, trigger } from '@angular/animations';

@Component({
  selector: 'app-project-detail',
  animations: [
    trigger('collapseExpand', [
      state('collapsed', style({
        height: '120px',
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: 'auto',
        overflow: 'visible'
      })),
    ]),
  ],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  @Input() public project: Project;
  @Input() public indexes: Map<number, number>;
  @Input() public nextIndex = 0;

  public isCollapsed = true;
  public isLongDescription = true;
  mode = ModalTypes.EDIT;

  constructor(private projectService: ProjectService) {
  }

  ngOnInit() {
    if (this.project) {
      this.isLongDescription = this.project.description.length > 300;
    }
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }

  deleteLogo(projectId: string, logoIndex: number) {
    if (confirm('Are you sure you want to delete this logo?')) {
      this.projectService.deleteLogo(projectId, logoIndex).subscribe(event => {
        setTimeout(() => {
          location.reload();
        }, 800);
      });
    }
  }

  deletePicture(projectId: string, picIndex: number) {
    if (confirm('Are you sure you want to delete this logo?')) {
      this.projectService.deletePicture(projectId, picIndex).subscribe(event => {
        setTimeout(() => {
          location.reload();
        }, 800);
      });
    }
  }
}
