import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    this.authService.login('test@gmail.com', '123456').subscribe((user) => {
      this.router.navigate(['/']);
    });
  }
}
