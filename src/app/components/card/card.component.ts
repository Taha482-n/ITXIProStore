// src/app/components/card/card.component.ts
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
  @Input() title: string = 'Default Title';
  @Input() subtitle: string = ''; // New input for subtitle
  @Input() content: string = 'Default content goes here.';
}
