// src/app/guards/auth.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { MockAuth } from '../app/mocks/auth.mock';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockAuth: MockAuth;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuth = new MockAuth();
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Auth, useValue: mockAuth },
        { provide: Router, useValue: mockRouter },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should allow activation when user is authenticated', (done) => {
    const mockUser = {
      uid: '123',
      email: 'authenticated@example.com',
      emailVerified: true,
      isAnonymous: false,
      metadata: {} as any,
      providerData: [],
      refreshToken: '',
      tenantId: null,
      delete: jasmine.createSpy('delete'),
      getIdToken: jasmine.createSpy('getIdToken').and.returnValue(Promise.resolve('mockIdToken')),
      getIdTokenResult: jasmine.createSpy('getIdTokenResult').and.returnValue(Promise.resolve({})),
      reload: jasmine.createSpy('reload'),
      toJSON: jasmine.createSpy('toJSON').and.returnValue({}),
      displayName: 'Authenticated User',
      phoneNumber: null,
      photoURL: null,
      providerId: 'firebase',
    } as unknown as any; // Using `any` since User interface might be complex

    // Simulate user login
    mockAuth.changeAuthState(mockUser);

    guard.canActivate().subscribe((canActivate) => {
      expect(canActivate).toBeTrue();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should prevent activation and redirect when user is not authenticated', (done) => {
    // Simulate user logout
    mockAuth.changeAuthState(null);

    guard.canActivate().subscribe((canActivate) => {
      expect(canActivate).toBeFalse();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });
});
