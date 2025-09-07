import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Information } from '../../../models/information.model';
import { InformationService } from '../../../services/information.service';
import { AuthService } from '../../../services/auth.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-information-list',
  standalone: true,
  imports: [SharedModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Information</h2>
        <div class="d-flex gap-2">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="Search..."
              [(ngModel)]="searchTerm"
              (keyup.enter)="search()"
            >
            <button class="btn btn-outline-secondary" type="button" (click)="search()">
              Search
            </button>
          </div>
          <button class="btn btn-primary" (click)="createNew()">Add New</button>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let item of informationList">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="badge" [ngClass]="getBadgeClass(item.type)">{{item.type}}</span>
              <div class="btn-group">
                <button class="btn btn-sm btn-outline-primary" (click)="editItem(item)">
                  Edit
                </button>
                <button class="btn btn-sm btn-outline-danger" (click)="deleteItem(item)">
                  Delete
                </button>
              </div>
            </div>
            <div class="card-body">
              <p class="card-text">{{item.value}}</p>
              <div class="mt-2">
                <span 
                  *ngFor="let tag of item.tags" 
                  class="badge bg-secondary me-1"
                  style="cursor: pointer"
                  (click)="searchByTag(tag)"
                >
                  {{tag}}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="informationList.length === 0" class="text-center mt-4">
        <p>No information found. Start by adding some!</p>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-2px);
    }
    .badge {
      padding: 0.5em 0.8em;
    }
    .badge.bg-info {
      background-color: #17a2b8;
      color: white;
    }
    .badge.bg-success {
      background-color: #28a745;
    }
    .badge.bg-warning {
      background-color: #ffc107;
      color: #212529;
    }
    .badge.bg-danger {
      background-color: #dc3545;
    }
    .badge.bg-primary {
      background-color: #007bff;
    }
  `]
})
export class InformationListComponent implements OnInit {
  informationList: Information[] = [];
  searchTerm = '';
  loading = false;

  constructor(
    private informationService: InformationService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadInformation();
  }

  loadInformation() {
    this.loading = true;
    this.informationService.getAll().subscribe({
      next: (data) => {
        this.informationList = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading information:', error);
        this.loading = false;
      }
    });
  }

  createNew() {
    this.router.navigate(['/information/new']);
  }

  editItem(item: Information) {
    this.router.navigate(['/information/edit', item.id]);
  }

  deleteItem(item: Information) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.informationService.delete(item.id!).subscribe({
        next: () => {
          this.loadInformation();
        },
        error: (error) => {
          console.error('Error deleting item:', error);
        }
      });
    }
  }

  search() {
    if (!this.searchTerm.trim()) {
      this.loadInformation();
      return;
    }

    this.informationService.search(this.searchTerm).subscribe({
      next: (data) => {
        this.informationList = data;
      },
      error: (error) => {
        console.error('Error searching:', error);
      }
    });
  }

  searchByTag(tag: string) {
    this.informationService.searchByTags([tag]).subscribe({
      next: (data) => {
        this.informationList = data;
      },
      error: (error) => {
        console.error('Error searching by tag:', error);
      }
    });
  }

  getBadgeClass(type: string): string {
    switch (type) {
      case 'COMMAND':
        return 'bg-info';
      case 'LINK':
        return 'bg-primary';
      case 'PROCEDURE':
        return 'bg-success';
      case 'CONTACT':
        return 'bg-warning';
      case 'CREDENTIAL':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}
