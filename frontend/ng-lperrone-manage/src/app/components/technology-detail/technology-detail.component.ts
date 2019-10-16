import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-technology-detail',
  templateUrl: './technology-detail.component.html',
  styleUrls: ['./technology-detail.component.scss']
})
export class TechnologyDetailComponent implements OnInit {
  @Input() public technology: any = {};

  constructor() { }

  ngOnInit() {
  }

}
