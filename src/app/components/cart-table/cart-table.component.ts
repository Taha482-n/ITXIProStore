import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-table',
  templateUrl: './cart-table.component.html',
  styleUrls: ['./cart-table.component.css'],
  standalone: true,
  imports: [CommonModule, MatButtonModule,MatIconModule, FormsModule],
})
export class CartTableComponent {
  @Input() cartItems: any[] = []; // Cart items data
  @Input() totalPrice: number = 0; // Total price of cart items
  @Output() removeItem = new EventEmitter<number>(); // Event to remove an item from cart

  onRemoveItem(productId: number) {
    this.removeItem.emit(productId); // Emit event to parent
  }
}
