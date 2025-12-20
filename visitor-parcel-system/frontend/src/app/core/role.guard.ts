import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        const user = this.authService.getUser();
        if (!user) {
            return this.router.createUrlTree(['/login']);
        }

        const expectedRoles = route.data['roles'] as Array<string>;
        if (expectedRoles && !expectedRoles.includes(user.role)) {
            // Redirect to appropriate dashboard or unauthorized
            return false;
        }

        return true;
    }
}
