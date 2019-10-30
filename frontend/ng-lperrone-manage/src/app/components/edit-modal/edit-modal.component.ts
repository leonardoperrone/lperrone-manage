import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TechnologyService } from '../../services/technology.service';
import { HttpEventType } from '@angular/common/http';
import { toFormData } from '../../commons/toFormData';
import { Technology } from '../../models/Technology';
import { ModalTypes } from '../../enums/modal-types.enum';
import { Project } from '../../models/project';
import { ProjectService } from '../../services/project.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit, OnDestroy {
  @Input() technology: Technology;
  @Input() project: Project;
  @Input() mode: ModalTypes;
  @Input() indexes: Map<number, number>;
  @Input() nextIndex = 0;

  loading = false;
  submitted = false;
  errorMessage = '';
  progress = 0;
  isEditMode = null;
  isCreateMode = null;
  isTech = false;
  isProject = false;
  indexesSubscription: Subscription;
  isIndexUnique = true;

  techForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required,
      Validators.minLength(1),
      Validators.maxLength(520)]],
    experience: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
    orderIndex: [this.nextIndex, Validators.required]
  });

  projectForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required,
      Validators.minLength(1),
      Validators.maxLength(1050)]],
    city: ['', Validators.required],
    country: ['', Validators.required],
    year: [null, Validators.required],
    // TODO: actually set a proper index value here
    orderIndex: [this.nextIndex, Validators.required]
  });

  logosForm = this.fb.group({
    logos: ['', [Validators.required]]
  });

  picForm = this.fb.group({
    pictures: ['', [Validators.required]]
  });

  constructor(private modalService: NgbModal,
              private fb: FormBuilder,
              private router: Router,
              private technologyService: TechnologyService,
              private projectService: ProjectService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.isEditMode = this.mode === ModalTypes.EDIT;
    this.isCreateMode = this.mode === ModalTypes.CREATE;
    const page = this.route.snapshot.routeConfig.path;
    this.isTech = page === 'skills';
    this.isProject = page === 'projects';
    if (this.project) {
      this.projectForm.patchValue(this.project);
    } else if (this.technology) {
      this.techForm.patchValue(this.technology);
    }
    const form = this.isProject ? this.projectForm : this.techForm;
    this.indexesSubscription = form.get('orderIndex').valueChanges.subscribe(orderIndex => {
      const formType = this.project ? this.project : this.technology;
      const isUniqueAndCreateMode = this.indexes.get(form.get('orderIndex').value) && this.isEditMode
        && formType.orderIndex !== orderIndex;
      const isUniqueAndEditMode = this.indexes.get(form.get('orderIndex').value)
        && this.isCreateMode;

      this.isIndexUnique = !(isUniqueAndCreateMode || isUniqueAndEditMode);
    });


  }

  // TODO: refactor this bit, clumsy and repetitive
  openScrollableContent(longContent) {

    this.modalService.open(longContent, {centered: true, size: 'lg'});

    if (this.isTech && this.isEditMode) {
    } else if (this.isTech && this.isCreateMode) {
      this.techForm.addControl('logos', new FormControl(''));
    } else if (this.isProject && this.isCreateMode) {
      this.projectForm.addControl('logos', new FormControl(''));
      this.projectForm.addControl('pictures', new FormControl(''));
    }
  }

  onSubmit(form) {
    this.submitted = true;
    if (form.invalid) {
      return;
    }

    let obs;
    this.loading = true;
    if (this.isTech) {
      obs = this.isCreateMode ?
        this.technologyService.createTechnology(toFormData(form.value)) :
        this.technologyService.updateTechnology(this.technology._id, toFormData(form.value));
    } else if (this.isProject) {
      obs = this.isCreateMode ?
        this.projectService.createProject(toFormData(form.value)) :
        this.projectService.updateProject(this.project._id, toFormData(form.value));
    }

    obs.subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round((100 * event.loaded) / event.total);
      }
      if (event.type === HttpEventType.Response) {
        form.reset();
        this.modalService.dismissAll();
        this.loading = false;
        setTimeout(() => {
          location.reload();
        }, 800);
      }

    }, error => {
      console.log(error);
      form.reset();
      this.modalService.dismissAll();
      this.loading = false;
    });
  }

  // TODO: unify these delete methods, DRY
  deleteTech(techId: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.loading = true;
      this.technologyService.deleteTechnology(techId).subscribe(event => {
        this.loading = false;
        this.modalService.dismissAll();
        setTimeout(() => {
          location.reload();
        }, 800);
      });
    }
  }

  deleteProject(projectId: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.loading = true;
      this.projectService.deleteProject(projectId).subscribe(event => {
        this.loading = false;
        this.modalService.dismissAll();
        setTimeout(() => {
          location.reload();
        }, 800);
      });
    }
  }

  ngOnDestroy(): void {
    this.indexesSubscription.unsubscribe();
  }
}
