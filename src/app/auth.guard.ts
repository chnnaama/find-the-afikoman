import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take, tap } from 'rxjs/operators';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService,
              private spinnerService: SpinnerService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.spinnerService.toggle(true);

    return this.auth.user$.pipe(
      take(1),
      tap(() => this.spinnerService.toggle(false)),
      map(user => !!user)
    );
  }

}
