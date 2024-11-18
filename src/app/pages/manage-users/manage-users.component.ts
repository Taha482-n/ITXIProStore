import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { UsersTableComponent } from '../../components/users-table/users-table.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
  standalone: true,
  imports: [CommonModule, UsersTableComponent], // Add UsersTableComponent and CommonModule
})
export class ManageUsersComponent implements OnInit {
  users$: Observable<User[]> = new Observable<User[]>(); // Initialize with an empty observable

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    const usersCollection = collection(this.firestore, 'users');
    this.users$ = collectionData(usersCollection, { idField: 'uid' }) as Observable<User[]>;
  }
}
