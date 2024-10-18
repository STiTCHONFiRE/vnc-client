import { Component } from '@angular/core';
import { AuthService } from './service/auth.service';
import { BehaviorSubject } from 'rxjs';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  Router,
} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loading$.next(false);
      }

      if (event instanceof NavigationCancel) {
        this.loading$.next(false);
      }

      if (event instanceof NavigationError) {
        this.loading$.next(false);
      }
    });
  }

  login() {
    this.authService.login();
  }

  isAuth() {
    return this.authService.isAuth();
  }

  isErr() {
    return this.authService.isErr();
  }
}
