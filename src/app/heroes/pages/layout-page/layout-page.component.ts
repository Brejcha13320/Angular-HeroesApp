import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.scss',
})
export class LayoutPageComponent {
  sidebarItems = [
    {
      label: 'Listado',
      icon: 'label',
      url: './list',
    },
    {
      label: 'Añadir',
      icon: 'add',
      url: './new-hero',
    },
    {
      label: 'Buscar',
      icon: 'search',
      url: './search',
    },
  ];

  constructor(private router: Router, private authService: AuthService) {}

  get user(): User | undefined {
    return this.authService.currentUser;
  }

  onLogOut() {
    this.authService.logOut();
    this.router.navigate(['/auth/login']);
  }
}
