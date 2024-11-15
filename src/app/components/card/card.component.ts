import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  standalone: true,
  imports: [MatCardModule, CommonModule],
})
export class CardComponent {
  @Input() title: string = 'Default Title';        // Default title if none provided
  @Input() subtitle: string = '';                   // Optional subtitle
  @Input() content: string = 'Default content goes here.'; // Default content

}
