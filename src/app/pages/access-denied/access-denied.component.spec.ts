import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessDeniedComponent } from './access-denied.component';

describe('AccessDeniedComponent', () => {
  let component: AccessDeniedComponent;
  let fixture: ComponentFixture<AccessDeniedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessDeniedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.access-denied-title')?.textContent).toContain('403 - Access Denied');
  });

  it('should display the correct message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.access-denied-message')?.textContent).toContain('You do not have permission to view this page.');
  });

  it('should have a "Go Back" button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.go-back-btn')).toBeTruthy();
  });
});
