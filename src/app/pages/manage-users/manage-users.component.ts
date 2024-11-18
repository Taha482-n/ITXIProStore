import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
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
    MatFormFieldModule,
    CommonModule,
    FormsModule,
  ],
})
export class AdminComponent implements OnInit {
  users$!: Observable<User[]>; // Using definite assignment assertion

  roles: string[] = ['user', 'weather-manager', 'admin'];
  displayedColumns: string[] = ['email', 'role']; 
  
  constructor(private firestore: Firestore) {}

  ngOnInit() {
    // Initialize Firestore collection reference for 'users'
    const usersCollection = collection(this.firestore, 'users');
    // Get real-time data from Firestore collection
    this.users$ = collectionData(usersCollection, { idField: 'uid' }) as Observable<User[]>;
  }

  async changeRole(user: User, newRole: string) {
    // Get Firestore document reference for the user
    const userDocRef = doc(this.firestore, 'users', user.uid);
    // Update the user's role in Firestore
    await updateDoc(userDocRef, { role: newRole });
  }
}
