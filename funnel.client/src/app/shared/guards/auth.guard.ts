import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { LoginService } from "../../services/login.service";

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: LoginService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = localStorage.getItem('currentUser');
    const lastActivity = localStorage.getItem('lastActivity');
    if (!currentUser || !lastActivity) {
      this.router.navigate(['/login']);
      return false;
    }

    const timeDiff = Date.now() - parseInt(lastActivity);
    if (timeDiff > 30 * 60 * 1000) { 
      this.authService.logout('La sesión ha expirado: guard');
      return false;
    }
    this.authService.resetTimer();
    return true;
  }
}
