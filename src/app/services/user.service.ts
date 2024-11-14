// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user$: Observable<any>;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.user$ = new Observable((observer) => {
      this.auth.onAuthStateChanged((user) => {
        observer.next(user);
      });
    });
  }

  getCurrentUserRole(): Observable<string | null> {
    return this.user$.pipe(
      switchMap((user) => {
        if (user) {
          const docRef = doc(this.firestore, `users/${user.uid}`);
          return from(getDoc(docRef)).pipe(
            map((docSnap) => {
              if (docSnap.exists()) {
                const data = docSnap.data();
                return data['role'] || 'user'; // Default to 'user' role
              }
              return 'user'; // Default to 'user' role
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }
}
