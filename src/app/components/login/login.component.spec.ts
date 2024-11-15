import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { signInWithEmailAndPassword } from '@angular/fire/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let auth: Auth;
  let router: Router;
  let signInSpy: jasmine.Spy;

  beforeEach(async () => {
    const authStub = {} as Auth;
    const routerStub = {
      navigate: jasmine.createSpy('navigate'),
    };

    // Spy on the standalone `signInWithEmailAndPassword` function
    signInSpy = jasmine.createSpy('signInWithEmailAndPassword').and.callFake(
      (auth: Auth, email: string, password: string) => {
        if (password === 'password123') {
          return Promise.resolve(); // Simulate successful login
        } else {
          return Promise.reject({ message: 'Invalid email or password' }); // Simulate failed login
        }
      }
    );

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        CommonModule,
        LoginComponent,
      ],
      providers: [
        { provide: Auth, useValue: authStub },
        { provide: Router, useValue: routerStub },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    auth = TestBed.inject(Auth);
    router = TestBed.inject(Router);

    // Replace the actual function with the spy
    (signInWithEmailAndPassword as jasmine.Spy) = signInSpy;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should validate form controls', () => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');

    emailControl?.setValue('');
    passwordControl?.setValue('');

    expect(emailControl?.valid).toBeFalse();
    expect(passwordControl?.valid).toBeFalse();

    emailControl?.setValue('test@example.com');
    passwordControl?.setValue('password123');

    expect(emailControl?.valid).toBeTrue();
    expect(passwordControl?.valid).toBeTrue();
  });

  it('should navigate to home on successful login', fakeAsync(() => {
    const email = 'test@example.com';
    const password = 'password123';

    component.loginForm.setValue({ email, password });

    component.login();
    tick();

    expect(signInSpy).toHaveBeenCalledWith(auth, email, password);
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
    expect(component.errorMessage).toBe('');
  }));

  it('should display error message on failed login', fakeAsync(() => {
    const email = 'test@example.com';
    const password = 'wrongpassword';
    const error = { message: 'Invalid email or password' };

    component.loginForm.setValue({ email, password });

    component.login();
    tick();

    expect(signInSpy).toHaveBeenCalledWith(auth, email, password);
    expect(component.errorMessage).toBe(error.message);
    expect(router.navigate).not.toHaveBeenCalled();
  }));
});
