import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { LoginService } from "../../services/login.service";

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: LoginService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = localStorage.getItem('currentUser');
    const lastActivity = localStorage.getItem('lastActivity');
    console.log("lastActivity antes", parseInt(lastActivity ?? '0') / (40 * 60 * 1000));
    if (!currentUser || !lastActivity) {
      this.router.navigate(['/login']);
      return false;
    }

    const timeDiff = Date.now() - parseInt(lastActivity);
    console.log("timeDiff", timeDiff / ( 60 * 1000));
    if (timeDiff > 40 * 60 * 1000) { // 30 minutos
      this.authService.logout();
      return false;
    }
    this.authService.resetTimer();
    console.log("lastActivity", parseInt(localStorage.getItem('lastActivity') ?? '0')/ (40 * 60 * 1000));
    return true;
  }
}
