import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService2 } from '@app/shared/services/auth2.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  isLoading: Boolean = false
  error: string = ""
  constructor(private authService2: AuthService2,private toastrService:ToastrService) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    this.isLoading = true
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    this.authService2.sendPasswordResetEmail(email).then(() => {
      this.isLoading = false
    })
      .catch(e => {
        this.isLoading = false
        this.error = e.message
        this.toastrService.error('Error while sending Reset Password Link', 'Error ', {
          timeOut: 5000
        });

      })

  }
} 