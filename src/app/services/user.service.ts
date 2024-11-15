// src/app/services/user.service.ts
import { Injectable, signal } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  authStatus = signal<User | null>(null); // Signal for auth status
  role = signal<string | null>(null); // Signal for user role

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, (user) => {
      this.authStatus.set(user);
      if (user) {
        this.fetchRole(user.uid); // Set role based on Firestore data
      } else {
        this.role.set(null);
      }
    });
  }

  public async fetchRole(userId: string): Promise<void> {
    const docRef = doc(this.firestore, `users/${userId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      this.role.set(data['role'] || 'user'); // Default role is 'user'
    } else {
      this.role.set('user');
    }
  }

  // Accessor methods for components to read signals
  get userRole(): string | null {
    return this.role();
  }

  get isAuthenticated(): boolean {
    return !!this.authStatus();
  }
}
