import { Component, Input, OnInit } from '@angular/core';
import { Technology } from '../../models/Technology';
import { ModalTypes } from '../../enums/modal-types.enum';
import { TechnologyService } from '../../services/technology.service';

@Component({
  selector: 'app-technology-detail',
  templateUrl: './technology-detail.component.html',
  styleUrls: ['./technology-detail.component.scss']
})
export class TechnologyDetailComponent implements OnInit {
  @Input() public technology: Technology;
  @Input() public indexes: Map<number, number>;
  @Input() public nextIndex = 0;

  mode = ModalTypes.EDIT;

  constructor(private technologyService: TechnologyService) {
  }

  ngOnInit() {
  }

  deleteLogo(techId: string, logoIndex: number) {
    if (confirm('Are you sure you want to delete this logo?')) {
      this.technologyService.deleteLogo(techId, logoIndex).subscribe(event => {
        setTimeout(() => {
          location.reload();
        }, 800);
      });
    }
  }
}
