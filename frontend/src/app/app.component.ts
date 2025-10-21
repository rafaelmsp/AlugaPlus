import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { NavbarComponent } from './core/layout/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
  template: `
    <div class="min-h-screen flex bg-neutral text-white">
      <app-sidebar *ngIf="isAuthenticated()"></app-sidebar>
      <div class="flex-1 flex flex-col">
        <app-navbar (logout)="handleLogout()" [user]="currentUser()"></app-navbar>
        <main class="flex-1 overflow-y-auto p-6 bg-surface">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser = signal(this.authService.getCurrentUser());
  readonly isAuthenticated = signal<boolean>(this.authService.isAuthenticated());

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.currentUser.set(user);
      this.isAuthenticated.set(!!user);
    });
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
























