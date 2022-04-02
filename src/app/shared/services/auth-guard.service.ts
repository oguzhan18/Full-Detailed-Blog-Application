import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { AuthService2 } from './auth2.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService2: AuthService2,
     private router: Router,private localStorageService:LocalStorageService
  ) { }

 async canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<any>{

    const token:any = await this.localStorageService.getDataFromIndexedDB("userData")
    if (token) {
      return true
    }
    this.router.navigateByUrl("/admin/auth")
    // if (this.authService2.isAuth()) {
    //   return true;
    // } else {
    //   this.router.navigate(['/admin/auth']);
    // }
  }
}