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
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Role</th>
                    <th>Avatar</th>
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
                      <img [src]="user.avatar" [alt]="user.name" width="50">
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
        margin: 0 auto;
        max-width: 1200px;
      }

      .card {
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        background: linear-gradient(to bottom, #ffffff, #f8f9fa);
      }

      .card-header {
        background: #007bff;
        color: white;
        padding: 16px;
        border-radius: 10px 10px 0 0;
        text-align: center;
      }

      .card-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: bold;
      }

      .card-content {
        padding: 16px;
      }

      .table-responsive {
        overflow-x: auto;
      }

      .user-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
      }

      .user-table th, .user-table td {
        text-align: left;
        padding: 12px;
        border-bottom: 1px solid #ddd;
        font-size: 14px;
      }

      .user-table th {
        background: #007bff;
        color: white;
      }

      .user-table tr:nth-child(even) {
        background-color: #f2f2f2;
      }

      .user-table tr:hover {
        background-color: #e8e8e8;
      }

      .pagination {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16px;
        font-size: 14px;
      }

      .pagination-buttons {
        display: flex;
        gap: 10px;
      }

      .btn {
        padding: 10px 20px;
        border: none;
        background-color: #007bff;
        color: white;
        font-size: 14px;
        cursor: pointer;
        border-radius: 5px;
        transition: background-color 0.3s;
      }

      .btn:hover {
        background-color: #0056b3;
      }

      .btn:disabled {
        background-color: #d6d6d6;
        cursor: not-allowed;
      }

      .skeleton-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .skeleton {
        height: 20px;
        background-color: #e0e0e0;
        border-radius: 4px;
        width: 100%;
      }

      .skeleton:nth-child(1) {
        width: 60%;
      }

      .skeleton:nth-child(2) {
        width: 80%;
      }

      .skeleton:nth-child(3) {
        width: 70%;
      }

      .skeleton:nth-child(4) {
        width: 50%;
      }

      .skeleton:nth-child(5) {
        width: 90%;
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
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedUsers = this.users.slice(start, end);
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

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.users.length);
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }
}
