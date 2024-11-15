// src/app/services/user.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, DocumentSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import * as AuthFunctions from '@angular/fire/auth';
import * as FirestoreFunctions from '@angular/fire/firestore';

describe('UserService', () => {
  let service: UserService;
  let mockAuth: jasmine.SpyObj<Auth>;
  let mockFirestore: jasmine.SpyObj<Firestore>;
  let authStateSubject: BehaviorSubject<User | null>;

  beforeEach(() => {
    // Initialize the BehaviorSubject to simulate auth state changes
    authStateSubject = new BehaviorSubject<User | null>(null);

    // Create spies for Auth and Firestore
    mockAuth = jasmine.createSpyObj('Auth', []);
    mockFirestore = jasmine.createSpyObj('Firestore', []);

    // Spy on the onAuthStateChanged function from AuthFunctions and simulate its behavior
    spyOn(AuthFunctions, 'onAuthStateChanged').and.callFake(
      (auth: Auth, callback: (user: User | null) => void) => {
        authStateSubject.subscribe(callback);
        return () => {}; // Return an unsubscribe function
      }
    );

    // Spy on the 'doc' and 'getDoc' functions from FirestoreFunctions
    spyOn(FirestoreFunctions, 'doc').and.callFake(
      (firestore: Firestore, path: string) => {
        return { firestore, path } as any; // Return a mock document reference
      }
    );

    spyOn(FirestoreFunctions, 'getDoc').and.callFake(
      (docRef: any) => {
        return Promise.resolve(docRef.dataSnap);
      }
    );

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: Auth, useValue: mockAuth },
        { provide: Firestore, useValue: mockFirestore },
      ],
    });

    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set authStatus and fetch role when user logs in with role', async () => {
    const mockUser: User = {
      uid: 'user123',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
      isAnonymous: false,
      phoneNumber: null,
      photoURL: null,
      providerData: [],
      metadata: {
        lastSignInTime: '2023-01-01T00:00:00Z',
        creationTime: '2023-01-01T00:00:00Z',
      },
      providerId: 'firebase',
      refreshToken: '',
      tenantId: null,
      getIdToken: () => Promise.resolve('token'),
      getIdTokenResult: () =>
        Promise.resolve({
          token: 'token',
          claims: {},
          expirationTime: '',
          issuedAtTime: '',
          signInProvider: '',
          signInSecondFactor: null,
        }),
      reload: () => Promise.resolve(),
      delete: () => Promise.resolve(),
      toJSON: () => ({}),
    } as any;

    const mockDocSnap: Partial<DocumentSnapshot<any>> = {
      exists: () => true,
      data: () => ({ role: 'admin' }),
    };

    // Assign the mock document snapshot to the docRef
    (FirestoreFunctions.doc as jasmine.Spy).and.returnValue({ dataSnap: mockDocSnap } as any);

    // Simulate user login
    authStateSubject.next(mockUser);

    // Wait for async operations
    await Promise.resolve();

    expect(service.authStatus()).toEqual(mockUser);
    expect(FirestoreFunctions.doc).toHaveBeenCalledWith(mockFirestore, `users/${mockUser.uid}`);
    expect(FirestoreFunctions.getDoc).toHaveBeenCalled();

    expect(service.role()).toEqual('admin');
  });

  it('should set role to "user" if role is not present in Firestore', async () => {
    const mockUser: User = {
      uid: 'user456',
      email: 'test2@example.com',
      displayName: 'Test User 2',
      emailVerified: true,
      isAnonymous: false,
      phoneNumber: null,
      photoURL: null,
      providerData: [],
      metadata: {
        lastSignInTime: '2023-02-01T00:00:00Z',
        creationTime: '2023-02-01T00:00:00Z',
      },
      providerId: 'firebase',
      refreshToken: '',
      tenantId: null,
      getIdToken: () => Promise.resolve('token'),
      getIdTokenResult: () =>
        Promise.resolve({
          token: 'token',
          claims: {},
          expirationTime: '',
          issuedAtTime: '',
          signInProvider: '',
          signInSecondFactor: null,
        }),
      reload: () => Promise.resolve(),
      delete: () => Promise.resolve(),
      toJSON: () => ({}),
    } as any;

    const mockDocSnap: Partial<DocumentSnapshot<any>> = {
      exists: () => true,
      data: () => ({}), // No role field
    };

    // Assign the mock document snapshot to the docRef
    (FirestoreFunctions.doc as jasmine.Spy).and.returnValue({ dataSnap: mockDocSnap } as any);

    // Simulate user login
    authStateSubject.next(mockUser);

    // Wait for async operations
    await Promise.resolve();

    expect(service.authStatus()).toEqual(mockUser);
    expect(FirestoreFunctions.doc).toHaveBeenCalledWith(mockFirestore, `users/${mockUser.uid}`);
    expect(FirestoreFunctions.getDoc).toHaveBeenCalled();

    expect(service.role()).toEqual('user');
  });

  it('should set role to "user" if Firestore document does not exist', async () => {
    const mockUser: User = {
      uid: 'user789',
      email: 'test3@example.com',
      displayName: 'Test User 3',
      emailVerified: true,
      isAnonymous: false,
      phoneNumber: null,
      photoURL: null,
      providerData: [],
      metadata: {
        lastSignInTime: '2023-03-01T00:00:00Z',
        creationTime: '2023-03-01T00:00:00Z',
      },
      providerId: 'firebase',
      refreshToken: '',
      tenantId: null,
      getIdToken: () => Promise.resolve('token'),
      getIdTokenResult: () =>
        Promise.resolve({
          token: 'token',
          claims: {},
          expirationTime: '',
          issuedAtTime: '',
          signInProvider: '',
          signInSecondFactor: null,
        }),
      reload: () => Promise.resolve(),
      delete: () => Promise.resolve(),
      toJSON: () => ({}),
    } as any;

    const mockDocSnap: Partial<DocumentSnapshot<any>> = {
      exists: () => false,
    };

    // Assign the mock document snapshot to the docRef
    (FirestoreFunctions.doc as jasmine.Spy).and.returnValue({ dataSnap: mockDocSnap } as any);

    // Simulate user login
    authStateSubject.next(mockUser);

    // Wait for async operations
    await Promise.resolve();

    expect(service.authStatus()).toEqual(mockUser);
    expect(FirestoreFunctions.doc).toHaveBeenCalledWith(mockFirestore, `users/${mockUser.uid}`);
    expect(FirestoreFunctions.getDoc).toHaveBeenCalled();

    expect(service.role()).toEqual('user');
  });

  it('should set authStatus to null and role to null when user logs out', async () => {
    // Initially logged out
    expect(service.authStatus()).toBeNull();
    expect(service.role()).toBeNull();

    // Simulate user login
    const mockUser: User = {
      uid: 'user123',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
      isAnonymous: false,
      phoneNumber: null,
      photoURL: null,
      providerData: [],
      metadata: {
        lastSignInTime: '2023-01-01T00:00:00Z',
        creationTime: '2023-01-01T00:00:00Z',
      },
      providerId: 'firebase',
      refreshToken: '',
      tenantId: null,
      getIdToken: () => Promise.resolve('token'),
      getIdTokenResult: () =>
        Promise.resolve({
          token: 'token',
          claims: {},
          expirationTime: '',
          issuedAtTime: '',
          signInProvider: '',
          signInSecondFactor: null,
        }),
      reload: () => Promise.resolve(),
      delete: () => Promise.resolve(),
      toJSON: () => ({}),
    } as any;

    const mockDocSnap: Partial<DocumentSnapshot<any>> = {
      exists: () => true,
      data: () => ({ role: 'admin' }),
    };

    // Assign the mock document snapshot to the docRef
    (FirestoreFunctions.doc as jasmine.Spy).and.returnValue({ dataSnap: mockDocSnap } as any);

    // Simulate user login
    authStateSubject.next(mockUser);

    // Wait for async operations
    await Promise.resolve();

    expect(service.authStatus()).toEqual(mockUser);
    expect(service.role()).toEqual('admin');

    // Simulate user logout
    authStateSubject.next(null);

    expect(service.authStatus()).toBeNull();
    expect(service.role()).toBeNull();
  });

  it('should return correct userRole and isAuthenticated', async () => {
    const mockUser: User = {
      uid: 'user123',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
      isAnonymous: false,
      phoneNumber: null,
      photoURL: null,
      providerData: [],
      metadata: {
        lastSignInTime: '2023-01-01T00:00:00Z',
        creationTime: '2023-01-01T00:00:00Z',
      },
      providerId: 'firebase',
      refreshToken: '',
      tenantId: null,
      getIdToken: () => Promise.resolve('token'),
      getIdTokenResult: () =>
        Promise.resolve({
          token: 'token',
          claims: {},
          expirationTime: '',
          issuedAtTime: '',
          signInProvider: '',
          signInSecondFactor: null,
        }),
      reload: () => Promise.resolve(),
      delete: () => Promise.resolve(),
      toJSON: () => ({}),
    } as any;

    const mockDocSnap: Partial<DocumentSnapshot<any>> = {
      exists: () => true,
      data: () => ({ role: 'user' }),
    };

    // Assign the mock document snapshot to the docRef
    (FirestoreFunctions.doc as jasmine.Spy).and.returnValue({ dataSnap: mockDocSnap } as any);

    // Simulate user login
    authStateSubject.next(mockUser);

    // Wait for async operations
    await Promise.resolve();

    expect(service.userRole).toEqual('user');
    expect(service.isAuthenticated()).toBeTrue();

    // Simulate user logout
    authStateSubject.next(null);

    expect(service.userRole()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });
});
