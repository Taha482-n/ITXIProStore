import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Firestore compat module for Firebase SDK v9+
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Correct for Firebase compat version
import { environment } from '../../../environments/environment'; // Your Firebase config

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let mockFirestore: any;

  const mockUsers = [
    { uid: '1', email: 'user1@example.com', role: 'user' },
    { uid: '2', email: 'user2@example.com', role: 'admin' },
  ];

  beforeEach(async () => {
    // Create mock Firestore with explicit spies for methods
    mockFirestore = {
      collection: jasmine.createSpy('collection').and.returnValue({
        get: jasmine.createSpy().and.returnValue(of(mockUsers)),
      }),
      doc: jasmine.createSpy('doc').and.callFake((path: string) => ({
        update: jasmine.createSpy().and.returnValue(Promise.resolve()),
      })),
      updateDoc: jasmine.createSpy('updateDoc').and.returnValue(Promise.resolve()), // Mock updateDoc
    };

    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatSelectModule,
        MatFormFieldModule,
        CommonModule,
        FormsModule,
        // Initialize Firebase app with the provided environment config
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        // Firestore Module required for Firestore services to work
        AngularFirestoreModule, // Add AngularFirestoreModule for Firestore services
        AdminComponent,  // Import the standalone component directly
      ],
      providers: [
        { provide: AngularFirestore, useValue: mockFirestore }, // Provide mock Firestore
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users and display them in the table', fakeAsync(() => {
    component.ngOnInit(); // Trigger the initialization method
    tick(); // Simulate async passage of time for fetching data

    // Check if the users are fetched correctly
    component.users$.subscribe((users) => {
      expect(users.length).toBe(2);
      expect(users[0].email).toBe('user1@example.com');
      expect(users[1].role).toBe('admin');
    });
  }));

  it('should call Firestore updateDoc when changing user role', fakeAsync(() => {
    const mockUser = { uid: '1', email: 'user1@example.com', role: 'user' };
    const newRole = 'admin';

    // Trigger the role change
    component.changeRole(mockUser, newRole);
    tick(); // Simulate async passage of time

    // Validate that `updateDoc` was called with correct arguments
    expect(mockFirestore.updateDoc).toHaveBeenCalledWith(mockFirestore.doc(`users/${mockUser.uid}`), { role: newRole });
  }));
});
