import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">User Table</h2>
        </div>
        <div class="card-content">
          <ng-container *ngIf="loading; else loadedContent">
            <div class="skeleton-container">
              <div *ngFor="let item of [1,2,3,4,5]" class="skeleton"></div>
            </div>
          </ng-container>
          <ng-template #loadedContent>
            <div class="table-responsive">
              <table class="user-table">
                <thead>
                  <tr>
                    <th (click)="sort('id')">ID 
                      <span class="sort-icon" [ngClass]="getSortClass('id')"></span>
                    </th>
                    <th (click)="sort('name')">Name 
                      <span class="sort-icon" [ngClass]="getSortClass('name')"></span>
                    </th>
                    <th (click)="sort('email')">Email 
                      <span class="sort-icon" [ngClass]="getSortClass('email')"></span>
                    </th>
                    <th>Password</th>
                    <th (click)="sort('role')">Role 
                      <span class="sort-icon" [ngClass]="getSortClass('role')"></span>
                    </th>
                    <th>Avatar</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let user of displayedUsers; trackBy: trackByUserId">
                    <td>{{ user.id }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.password }}</td>
                    <td>{{ user.role }}</td>
                    <td>
                      <img [src]="user.avatar" [alt]="user.name" class="avatar">
                    </td>
                    <td class="actions-cell">
                      <button (click)="editUser(user)" class="edit-btn">
                        <i class="fa fa-pencil"></i> Edit
                      </button>
                      <button (click)="viewUserInfo(user)" class="info-btn">
                        <i class="fa fa-info-circle"></i> Info
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="pagination">
              <span>Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ users.length }} entries</span>
              <div class="pagination-buttons">
                <button (click)="previousPage()" [disabled]="currentPage === 1" class="btn">Previous</button>
                <button (click)="nextPage()" [disabled]="endIndex >= users.length" class="btn">Next</button>
              </div>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* General styles for the table and container */
      .table-container {
        padding: 20px;
      }

      .card {
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .card-header {
        background-color: #f7f7f7;
        padding: 15px;
        font-size: 1.5rem;
        font-weight: bold;
      }

      .card-content {
        padding: 15px;
      }

      .table-responsive {
        overflow-x: auto;
      }

      .user-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }

      .user-table th, .user-table td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }

      .user-table th {
        background-color: #f2f2f2;
        cursor: pointer;
      }

      .skeleton-container {
        display: flex;
        flex-direction: column;
      }

      .skeleton {
        height: 20px;
        background-color: #ccc;
        margin-bottom: 10px;
        border-radius: 4px;
      }

      /* Pagination styles */
      .pagination {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 10px;
      }

      .pagination-buttons {
        display: flex;
        gap: 10px;
      }

      /* Action button styles */
      .actions-cell {
        display: flex;
        gap: 10px;
      }

      .edit-btn, .info-btn {
        padding: 6px 12px;
        font-size: 14px;
        margin-right: 10px;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        display: flex;
        align-items: center;
      }

      .edit-btn {
        background-color: #28a745;
        color: white;
      }

      .info-btn {
        background-color: #17a2b8;
        color: white;
      }

      .edit-btn:hover {
        background-color: #218838;
      }

      .info-btn:hover {
        background-color: #138496;
      }

      .edit-btn:focus, .info-btn:focus {
        outline: none;
      }

      .edit-btn i, .info-btn i {
        margin-right: 5px;
      }

      /* Sorting icon styles */
      .sort-icon {
        margin-left: 5px;
        font-size: 12px;
        color: #888;
      }

      .ascending::after {
        content: '▲';
      }

      .descending::after {
        content: '▼';
      }

      /* Image styles */
      .avatar {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 50%;
        margin: 0 auto;
      }
    `
  ]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  displayedUsers: User[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 5;
  sortField: keyof User | null = null;
  sortDirection: 'asc' | 'desc' | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.updateDisplayedUsers();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.loading = false;
      }
    });
  }

  updateDisplayedUsers() {
    let sortedUsers = [...this.users];
    if (this.sortField) {
      sortedUsers.sort((a, b) => {
        const aValue = a[this.sortField!];
        const bValue = b[this.sortField!];
        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedUsers = sortedUsers.slice(start, end);
  }

  sort(field: keyof User) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.updateDisplayedUsers();
  }

  getSortClass(field: keyof User): string {
    if (this.sortField === field) {
      return this.sortDirection === 'asc' ? 'ascending' : 'descending';
    }
    return '';
  }

  nextPage() {
    if (this.endIndex < this.users.length) {
      this.currentPage++;
      this.updateDisplayedUsers();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedUsers();
    }
  }

  trackByUserId(index: number, user: User) {
    return user.id;
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.users.length);
  }

  editUser(user: User) {
    alert(`Editing user: ${user.name}`);
    // Aquí puedes agregar la lógica para abrir un menú o formulario de edición.
  }

  viewUserInfo(user: User) {
    const userInfoWindow = window.open('', '_blank', 'width=400,height=300');
    if (userInfoWindow) {
      userInfoWindow.document.write(`
        <h2>${user.name}'s Information</h2>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Role:</strong> ${user.role}</p>
      `);
    }
  }
}
