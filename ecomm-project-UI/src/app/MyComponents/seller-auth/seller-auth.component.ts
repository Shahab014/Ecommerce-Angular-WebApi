import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { signUp } from 'src/app/models/sellerFields';
import { SellerServiceService } from 'src/app/services/seller-service.service';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.scss']
})
export class SellerAuthComponent {

  constructor(private http: HttpClient, private service: SellerServiceService,
    private router: Router, private toastr: ToastrService) { }

  // @ViewChild('myForm', { static: true })
  @ViewChild('myForm', { static: true }) //myForm!: NgForm;
  myForm!: signUp;
  showLogin = false;
  Role: string = 'seller';

  ngOnInit() {
    if (this.service.isSellerLoggedIn) {
      this.router.navigate(['seller-home']);
    }
  }

  Login(email: string, password: string) {
    this.service.login(email, password, 'seller');
  }

  signUp(data: any) {
    var val: signUp = {
      Name: data.value.name,
      Email: data.value.email,
      Password: data.value.password,
      Role: this.Role
    }
    this.service.signUp(val).subscribe();
    this.showLogin = true
    this.toastr.success("Registration Successful");
  }

  clickToLogin() {
    this.showLogin = true
  }

  clickToSignUp() {
    this.showLogin = false
  }

}
