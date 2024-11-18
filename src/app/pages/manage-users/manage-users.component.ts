import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  uid: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatPaginatorModule,
    CommonModule,
    FormsModule,
  ],
})
export class AdminComponent implements OnInit {
  dataSource = new MatTableDataSource<User>([]); // DataSource for the table
  roles: string[] = ['user', 'weather-manager', 'admin'];
  displayedColumns: string[] = ['email', 'role', 'actions']; // Add 'actions' column for delete button

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    const usersCollection = collection(this.firestore, 'users');
    collectionData(usersCollection, { idField: 'uid' }).subscribe((data) => {
      this.dataSource.data = data as User[];
    });
  }

  async changeRole(user: User, newRole: string) {
    const userDocRef = doc(this.firestore, 'users', user.uid);
    await updateDoc(userDocRef, { role: newRole });
  }

  async deleteUser(user: User) {
    const userDocRef = doc(this.firestore, 'users', user.uid);
    await deleteDoc(userDocRef);
    this.dataSource.data = this.dataSource.data.filter((u) => u.uid !== user.uid); // Update the table
  }
}
