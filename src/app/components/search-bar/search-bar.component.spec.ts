import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { By } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent, MatIconModule], // Import standalone component and dependencies
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a search icon', () => {
    const iconElement = fixture.debugElement.query(By.css('.search-icon')).nativeElement;
    expect(iconElement).toBeTruthy();
    expect(iconElement.textContent).toContain('search');
  });

  it('should emit a search value when input is typed', () => {
    spyOn(component.searchChange, 'emit'); // Spy on the `searchChange` output
    const inputElement = fixture.debugElement.query(By.css('.search-bar')).nativeElement;

    // Simulate user input
    inputElement.value = 'Test search';
    inputElement.dispatchEvent(new Event('input'));

    expect(component.searchChange.emit).toHaveBeenCalledWith('Test search');
  });

  it('should have a placeholder in the input field', () => {
    const inputElement = fixture.debugElement.query(By.css('.search-bar')).nativeElement;
    expect(inputElement.placeholder).toBe('Search for products...');
  });
});
