import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
    CanActivateChild
  } from '@angular/router';
  
  import { Injectable } from '@angular/core';

import { LocalStorageService } from './local-storage.service';
import { AuthService2 } from './auth2.service';
  
  @Injectable()
  export class SuperAdminAuthGuard implements CanActivate {
    constructor(private authService2: AuthService2,  private router: Router,
      private localStorageService:LocalStorageService
    ) { }
  
    async canActivate(route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Promise<any> {
  
     // let token = JSON.parse(localStorage.getItem("userData"))
      const token:any = await this.localStorageService.getDataFromIndexedDB("userData")
      if (token && token.role == "Admin" || token.role == "admin") {
        return true
      }
      this.authService2.logout()
      this.router.navigateByUrl("/admin/auth")
    }
  }