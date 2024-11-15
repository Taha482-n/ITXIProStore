// src/app/mocks/auth.mock.ts
import { User } from '@angular/fire/auth';

/**
 * MockAuth simulates Firebase's Auth service for testing purposes.
 */
export class MockAuth {
  // List of callbacks registered via onAuthStateChanged
  private authStateChangedCallbacks: Array<(user: User | null) => void> = [];

  /**
   * Simulates Firebase's onAuthStateChanged function.
   * @param callback The callback to register.
   * @returns An unsubscribe function.
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.authStateChangedCallbacks.push(callback);

    // Return an unsubscribe function
    return () => {
      const index = this.authStateChangedCallbacks.indexOf(callback);
      if (index > -1) {
        this.authStateChangedCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Simulates changing the authentication state.
   * Invokes all registered callbacks with the provided user.
   * @param user The new user, or null for unauthenticated state.
   */
  changeAuthState(user: User | null): void {
    this.authStateChangedCallbacks.forEach(callback => callback(user));
  }

  /**
   * Simulates signing in a user with email and password.
   * @param email The user's email.
   * @param password The user's password.
   * @returns A promise that resolves with the user object.
   */
  signInWithEmailAndPassword(email: string, password: string): Promise<{ user: User }> {
    // Create a mock user object based on the email
    const mockUser: User = {
      uid: 'mockUid',
      email: email,
      emailVerified: true,
      isAnonymous: false,
      metadata: {} as any, // Populate as needed
      providerData: [],
      refreshToken: 'mockRefreshToken',
      tenantId: null,
      delete: jasmine.createSpy('delete'),
      getIdToken: jasmine.createSpy('getIdToken').and.returnValue(Promise.resolve('mockIdToken')),
      getIdTokenResult: jasmine.createSpy('getIdTokenResult').and.returnValue(Promise.resolve({})),
      reload: jasmine.createSpy('reload'),
      toJSON: jasmine.createSpy('toJSON').and.returnValue({}),
      displayName: 'Mock User',
      phoneNumber: null,
      photoURL: null,
      providerId: 'firebase',
    } as unknown as User;

    // Emit the mock user as the current authenticated user
    this.changeAuthState(mockUser);

    return Promise.resolve({ user: mockUser });
  }

  /**
   * Simulates signing out the current user.
   * @returns A promise that resolves when the user is signed out.
   */
  signOut(): Promise<void> {
    // Emit `null` to indicate that no user is authenticated
    this.changeAuthState(null);
    return Promise.resolve();
  }

  /**
   * Simulates registering a new user with email and password.
   * @param email The user's email.
   * @param password The user's password.
   * @returns A promise that resolves with the user object.
   */
  createUserWithEmailAndPassword(email: string, password: string): Promise<{ user: User }> {
    // For simplicity, use the same mock user creation as signIn
    return this.signInWithEmailAndPassword(email, password);
  }

  // Add other Auth methods as needed
}
