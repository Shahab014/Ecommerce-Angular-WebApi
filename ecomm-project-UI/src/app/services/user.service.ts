import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { signUp } from '../models/sellerFields';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  Email: string = '';
  password: string = '';
  role:string = '';
  // isUserLoggedIn = new EventEmitter<boolean>(false);

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  signUp(data: signUp): Observable<signUp> {
    return this.http.post<signUp>(`${environment.apiUrl}/register`, data);
  }

  login(email: string, password: string, role: string) {
    this.Email = email;
    this.password = password;
    this.role = role;
    const credentials = { email: this.Email, password: this.password, role: this.role };

   
    this.http.post<any>(`${environment.apiUrl}/login`, credentials)
      .subscribe(
        (res) => {
          localStorage.setItem('userToken', res.Token);
          this.router.navigate(['home']);
        },
        (err) => {
          this.toastr.error("Invalid Credentials");
          console.error('Login Failed', err);
        }
      );
  }

  userAuthReload(){
    if(localStorage.getItem('userToken')){
      this.router.navigate(['/']);
    }
  }
}
