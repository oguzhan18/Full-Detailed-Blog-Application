import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit {
  isAuthenticated = false;

  isMenuOpen:boolean =false
  constructor(private router:Router) { }

  ngOnInit(): void {

  }

  openMenu(){
    this.isMenuOpen =!this.isMenuOpen
  }
  gotoDonate(){
    this.router.navigateByUrl("/user/donate")
  }
}