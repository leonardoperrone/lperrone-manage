import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-svg-viewer',
  templateUrl: './svg-viewer.component.html',
  styleUrls: ['./svg-viewer.component.scss']
})
export class SvgViewerComponent implements OnInit {
  @Input() public svgSpecs: any = {};
  public svgDash: string;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.svgSpecs && this.svgSpecs.experience) {
      this.svgDash = ((parseInt(this.svgSpecs.experience, 10) / 100) * 100 * 3.14).toString();
    }
  }
}
