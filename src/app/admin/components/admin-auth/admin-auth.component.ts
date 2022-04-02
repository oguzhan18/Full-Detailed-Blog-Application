import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService2 } from '@app/shared/services/auth2.service';


@Component({
  selector: 'app-admin-auth',
  templateUrl: './admin-auth.component.html',
  styleUrls: ['./admin-auth.component.css']
})
export class AdminAuthComponent implements OnInit {

  constructor(
    private authService2:AuthService2,
) { }

  ngOnInit(): void {

  }


  isLoading = false;
  error: string = null;
  isPorfileset: boolean = false;


 async onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.isLoading = true;
    await this.authService2.login({
      email: form.value.email,
      password: form.value.password
    });
  
    form.reset();
    this.isLoading = false
  }
}
