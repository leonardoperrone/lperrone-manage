import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent,
      multi: true
    }
  ]
})

export class FileUploadComponent implements ControlValueAccessor {
  @Input() progress;
  @Input() fileName;
  onChange: Function;
  private files: File[] = [];

  constructor(private host: ElementRef<HTMLInputElement>) {
  }

  @HostListener('change', ['$event.target.files']) emitFiles(fileList: FileList) {
    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        this.files.push(fileList.item(i));
        this.onChange(this.files);
      }
    }
  }

  writeValue(value: null) {
    // clear file input
    this.host.nativeElement.value = '';
    this.files = [];
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {
  }

  resetFiles() {
    this.files = [];
    this.onChange(this.files);
  }


}
