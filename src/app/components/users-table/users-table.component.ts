import { Component, Input, OnChanges, AfterViewInit, ViewChild, SimpleChanges } from '@angular/core';
import { Firestore, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    CommonModule,
  ],
})
export class UsersTableComponent implements OnChanges, AfterViewInit {
  @Input() users: User[] | null = null;
  dataSource = new MatTableDataSource<User>([]);
  displayedColumns: string[] = ['email', 'role', 'actions'];
  roles: string[] = ['user', 'weather-manager', 'admin'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private firestore: Firestore) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['users'] && this.users) {
      this.dataSource.data = this.users; // Update the table data
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async changeRole(user: User, newRole: string) {
    const userDocRef = doc(this.firestore, 'users', user.uid);
    await updateDoc(userDocRef, { role: newRole });
  }

  async deleteUser(user: User) {
    const userDocRef = doc(this.firestore, 'users', user.uid);
    await deleteDoc(userDocRef);
    this.dataSource.data = this.dataSource.data.filter((u) => u.uid !== user.uid);
  }
}
