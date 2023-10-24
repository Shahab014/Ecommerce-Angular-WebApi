import { Injectable } from '@angular/core';
import { addProduct, signUp } from '../models/sellerFields';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})

export class SellerServiceService {

  Email: string = '';
  password: string = '';
  role:string = '';
  isSellerLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }

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
          localStorage.setItem('sellerToken', res.Token);
          this.isSellerLoggedIn.next(true);
          this.router.navigate(['seller-home']);
        },
        (err) => {
          console.error('Login Failed', err);
        }
      );
  }


}
