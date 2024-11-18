import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersTableComponent } from './users-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule, MatSelect } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { User } from '../../models/user.model';
import { Firestore } from '@angular/fire/firestore';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SimpleChange } from '@angular/core';

describe('UsersTableComponent', () => {
  let component: UsersTableComponent;
  let fixture: ComponentFixture<UsersTableComponent>;
  let overlayContainerElement: HTMLElement;
  let overlayContainer: OverlayContainer;

  const mockUsers: User[] = [
    { uid: '1', email: 'user1@example.com', role: 'user' },
    { uid: '2', email: 'manager@example.com', role: 'weather-manager' },
    { uid: '3', email: 'admin@example.com', role: 'admin' },
  ];

  const mockFirestore = {
    doc: jasmine.createSpy('doc').and.returnValue({}),
    updateDoc: jasmine.createSpy('updateDoc').and.returnValue(Promise.resolve()),
    deleteDoc: jasmine.createSpy('deleteDoc').and.returnValue(Promise.resolve()),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UsersTableComponent, // Standalone component
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatSelectModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        CommonModule,
      ],
      providers: [
        { provide: Firestore, useValue: mockFirestore }, // Provide the mock Firestore
      ],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
    overlayContainerElement = overlayContainer.getContainerElement();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersTableComponent);
    component = fixture.componentInstance;
    // Do not assign users here; we'll do it in each test to ensure ngOnChanges() is called properly
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call deleteUser when the delete button is clicked', async () => {
    spyOn(component, 'deleteUser');
    component.users = mockUsers;
    component.ngOnChanges({
      users: new SimpleChange(null, mockUsers, true),
    });
    fixture.detectChanges();
    await fixture.whenStable();

    const deleteButtons = fixture.debugElement.queryAll(By.css('button[color="warn"]'));
    expect(deleteButtons.length).toBeGreaterThan(0); // Ensure we have delete buttons

    deleteButtons[0].nativeElement.click();

    expect(component.deleteUser).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('should call changeRole when a role is changed', async () => {
    spyOn(component, 'changeRole');
    component.users = mockUsers;
    component.ngOnChanges({
      users: new SimpleChange(null, mockUsers, true),
    });
    fixture.detectChanges();
    await fixture.whenStable();

    const roleSelects = fixture.debugElement.queryAll(By.directive(MatSelect));
    expect(roleSelects.length).toBeGreaterThan(0);

    // Open the select dropdown
    roleSelects[0].nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    // Find the overlay container and select an option
    const options = overlayContainerElement.querySelectorAll('mat-option');
    expect(options.length).toBeGreaterThan(0);

    (options[1] as HTMLElement).click(); // Selecting the second option for simplicity
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.changeRole).toHaveBeenCalled();
  });
});
