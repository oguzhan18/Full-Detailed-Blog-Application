import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService2 } from '@app/shared/services/auth2.service';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  isAuthenticated = false;
  private userSub: Subscription;
  isMenuOpen: boolean = false

  isUser
  uuid
  isAdmin
  userData

  constructor(
    private router: Router,
    private authService2: AuthService2,
    private localStorgaeService: LocalStorageService) {

  }

  async ngOnInit(): Promise<void> {

    this.authService2.initAuthListener();
    this.userData = await this.localStorgaeService.getDataFromIndexedDB("userData")
    if (this.userData) {
      
      this.isUser = this.userData.role == "user"
      this.isAdmin = this.userData.role !== "user"

    }

    this.userSub = this.authService2.user.subscribe(user => {
      if(user){
        if (user && user.role == "user") {
          this.isAdmin = false
        }
        else {
          this.isAdmin = user?.role == "admin"
        }
  
        this.isAuthenticated = !!user;
      }
      else{
        this.isAuthenticated = false
      }
     
    });
  }

  async onLogout() {
   this.authService2.logout()

  }

  gotoDonate() {
    this.router.navigateByUrl("/admin/view-donate")
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  openMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }

}
