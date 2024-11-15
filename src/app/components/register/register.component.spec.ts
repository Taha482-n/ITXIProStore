import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Auth } from '@angular/fire/auth'; // Import Auth from @angular/fire/auth

// Mock AngularFireAuth service
class MockAngularFireAuth {
  authState = of({ uid: '12345' }); // Simulate user auth state
  createUserWithEmailAndPassword(email: string, password: string) {
    return of({ user: { email, uid: '12345' } });
  }
}

// Mock Auth service (using Jasmine spy instead of Jest)
class MockAuth {
  onAuthStateChanged = jasmine.createSpy('onAuthStateChanged').and.callFake((callback: Function) => {
    callback({ uid: '12345' }); // Simulate user state change
    return { unsubscribe: jasmine.createSpy('unsubscribe') }; // Return an unsubscribe function
  });
}

// Mock Firestore service
const mockFirestoreService = {
  collection: jasmine.createSpy('collection').and.returnValue({
    add: jasmine.createSpy().and.returnValue(Promise.resolve('user added')),
  }),
};

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,  // Import the ReactiveFormsModule
        RouterTestingModule.withRoutes([]),  // Mock routing module
      ],
      providers: [
        { provide: AngularFireAuth, useClass: MockAngularFireAuth },  // Mock AngularFireAuth
        { provide: Auth, useClass: MockAuth },  // Mock Auth (for UserService)
        { provide: AngularFirestore, useValue: mockFirestoreService },  // Provide Firestore mock
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should validate form controls', () => {
    component.registerForm.controls['email'].setValue('test@example.com');
    component.registerForm.controls['password'].setValue('password123');
    expect(component.registerForm.valid).toBeTrue();
  });

  it('should register a user and save their role in Firestore', fakeAsync(() => {
    component.registerForm.controls['email'].setValue('test@example.com');
    component.registerForm.controls['password'].setValue('password123');

    component.register();  // Trigger the registration method
    tick();  // Simulate async passage of time

    // Check that Firestore's add method was called with correct data
    expect(mockFirestoreService.collection).toHaveBeenCalledWith('users');
    expect(mockFirestoreService.collection().add).toHaveBeenCalledWith({
      email: 'test@example.com',
      role: 'user',
    });
  }));

  it('should assign "admin" role for a specific email', fakeAsync(() => {
    component.registerForm.controls['email'].setValue('moetassem.wehbe.01@gmail.com');
    component.registerForm.controls['password'].setValue('password123');

    component.register();  // Trigger the registration method
    tick();  // Simulate async passage of time

    // Check that Firestore's add method was called with correct data
    expect(mockFirestoreService.collection).toHaveBeenCalledWith('users');
    expect(mockFirestoreService.collection().add).toHaveBeenCalledWith({
      email: 'moetassem.wehbe.01@gmail.com',
      role: 'admin',  // Ensure the role is 'admin' for this specific email
    });
  }));
});
