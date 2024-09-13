import {Injectable} from "@angular/core";
import {AuthService} from "@core";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class AdminGuard  {
  constructor(private authService: AuthService, private router: Router) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.currentUserValue.role === "ROLE_ADMIN") {
      return true;
    }
    this.router.navigate(['/authentication/signin']);
    return false;
  }
}
