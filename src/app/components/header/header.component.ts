// src/app/components/header/header.component.ts
import { Component } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
  ],
})
export class HeaderComponent {
  user$: Observable<any>;
  role$: Observable<string | null>;
  cartItemCount$: Observable<number>;

  constructor(
    private auth: Auth,
    private router: Router,
    private userService: UserService,
    private cartService: CartService
  ) {
    this.user$ = this.userService.user$;
    this.role$ = this.userService.getCurrentUserRole();
    this.cartItemCount$ = this.cartService.cart$.pipe(
      map(items => items.reduce((acc, item) => acc + item.quantity, 0))
    );
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/home']);
  }
}
