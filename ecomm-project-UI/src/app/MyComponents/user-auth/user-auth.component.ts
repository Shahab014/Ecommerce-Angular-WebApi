import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { addProduct, cart, signUp } from 'src/app/models/sellerFields';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.scss']
})
export class UserAuthComponent {

  @ViewChild('myForm', { static: true })
  myForm!: signUp;

  @ViewChild('userForm', { static: true })
  userForm!: signUp;

  showLogin = false;
  Role: string = 'user';

  constructor(private service: UserService, private toastr: ToastrService,
     private router: Router, private jwtHelper: JwtHelperService, private productService: ProductService) { }

  ngOnInit() {
    this.service.userAuthReload();
  }

  signUp(data: any) {
    var val: signUp = {
      Name: data.value.name,
      Email: data.value.email,
      Password: data.value.password,
      Role: this.Role
    }
    this.service.signUp(val).subscribe();
    this.toastr.success("Registration Successful");
    
  }

  Login(data: any) {
    this.service.login(data.email, data.password, 'user');  
  }

  openSignUp() {
    this.showLogin = true
  }

  openLogin() {
    this.showLogin = false
  }

}
