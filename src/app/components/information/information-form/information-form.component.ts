import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Information, InformationType } from '../../../models/information.model';
import { InformationService } from '../../../services/information.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-information-form',
  standalone: true,
  imports: [SharedModule],
  template: `
    <div class="container mt-4">
      <div class="card">
        <div class="card-header">
          <h4>{{ isEditing ? 'Edit' : 'Create' }} Information</h4>
        </div>
        <div class="card-body">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label for="type" class="form-label">Type</label>
              <select class="form-control" id="type" formControlName="type">
                <option value="">Select a type</option>
                <option *ngFor="let type of types" [value]="type">{{type}}</option>
              </select>
              <div class="invalid-feedback" *ngIf="submitted && f['type'].errors?.['required']">
                Type is required
              </div>
            </div>

            <div class="mb-3">
              <label for="value" class="form-label">Value</label>
              <textarea 
                class="form-control" 
                id="value" 
                formControlName="value" 
                rows="4"
              ></textarea>
              <div class="invalid-feedback" *ngIf="submitted && f['value'].errors?.['required']">
                Value is required
              </div>
            </div>

            <div class="mb-3">
              <label for="tags" class="form-label">Tags</label>
              <input 
                type="text" 
                class="form-control" 
                id="tags" 
                formControlName="tags" 
                placeholder="Enter tags separated by commas"
              >
            </div>

            <div class="d-flex justify-content-between">
              <button type="button" class="btn btn-secondary" (click)="goBack()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                {{ isEditing ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class InformationFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  isEditing = false;
  types = Object.values(InformationType);

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private informationService: InformationService
  ) {
    this.form = this.formBuilder.group({
      type: ['', Validators.required],
      value: ['', Validators.required],
      tags: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing = true;
      this.loadInformation(id);
    }
  }

  get f() { return this.form.controls; }

  private loadInformation(id: number) {
    this.informationService.getById(id).subscribe({
      next: (information: Information) => {
        this.form.patchValue({
          type: information.type,
          value: information.value,
          tags: information.tags.join(', ')
        });
      },
      error: (error) => {
        console.error('Error loading information:', error);
        this.router.navigate(['/information']);
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const formValue = this.form.value;
    const tags = formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
    
    const request = {
      type: formValue.type,
      value: formValue.value,
      tags
    };

    const id = this.route.snapshot.params['id'];
    const operation = id 
      ? this.informationService.update(id, request)
      : this.informationService.create(request);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/information']);
      },
      error: (error) => {
        console.error('Error saving information:', error);
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/information']);
  }
}
