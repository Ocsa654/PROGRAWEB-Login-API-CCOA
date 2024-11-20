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
                      <button (click)="deleteUser(user)" class="delete-btn">
                        <i class="fa fa-trash"></i> Delete
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
    .table-container {
      padding: 20px;
      background-color: #f9f9f9;
    }
    
    .card {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      background-color: #4CAF50;
      color: white;
      padding: 10px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      font-size: 1.5em;
    }

    .card-content {
      padding: 20px;
    }

    .user-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    .user-table th,
    .user-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .user-table th {
      background-color: #f1f1f1;
    }

    .actions-cell {
      display: flex;
      gap: 10px;
    }

    .edit-btn, .info-btn, .delete-btn {
      padding: 6px 12px;
      font-size: 14px;
      cursor: pointer;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }

    .edit-btn {
      background-color: #4CAF50;
      color: white;
    }

    .edit-btn:hover {
      background-color: #45a049;
    }

    .info-btn {
      background-color: #2196F3;
      color: white;
    }

    .info-btn:hover {
      background-color: #1e88e5;
    }

    .delete-btn {
      background-color: #f44336;
      color: white;
    }

    .delete-btn:hover {
      background-color: #e53935;
    }

    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }

    .pagination-buttons {
      display: flex;
      gap: 10px;
    }

    .pagination-btn {
      background-color: #6200ea;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .pagination-btn:hover {
      background-color: #3700b3;
    }

    .skeleton-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .skeleton {
      background-color: #ddd;
      height: 20px;
      width: 100%;
      border-radius: 5px;
      animation: skeleton-loading 1.5s infinite;
    }

    @keyframes skeleton-loading {
      0% {
        background-color: #ddd;
      }
      50% {
        background-color: #e0e0e0;
      }
      100% {
        background-color: #ddd;
      }
    }

    .sort-icon {
      margin-left: 5px;
      font-size: 0.8em;
      opacity: 0.5;
    }

    .ascending::after {
      content: "↑";
    }

    .descending::after {
      content: "↓";
    }

    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }  `]
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
    const editedUser = { ...user }; // Clonar el usuario para modificarlo
    const newName = prompt('Edit the user name:', editedUser.name);
    if (newName) {
      editedUser.name = newName;
      const index = this.users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        this.users[index] = editedUser; // Actualizar la lista local
        this.updateDisplayedUsers(); // Actualizar la vista
      }
    }
  }

  deleteUser(user: User) {
    const confirmDelete = confirm(`Are you sure you want to delete ${user.name}?`);
    if (confirmDelete) {
      this.users = this.users.filter(u => u.id !== user.id); // Eliminar de la lista local
      this.updateDisplayedUsers(); // Actualizar la vista
    }
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
