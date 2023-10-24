import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import jwtDecode from 'jwt-decode';

interface TokenPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string
}

@Injectable({
  providedIn: 'root'
})

class redirect {
  constructor(private route: Router) { }
  canActivate() {
    let role: string = '';
    const token = localStorage.getItem('sellerToken');
    if (token) {
      const tokenPayload = jwtDecode(token) as TokenPayload;
      role = tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    }

    if (localStorage.getItem('sellerToken') && role === 'seller') {
      return true;
    } else {
      this.route.navigate(['/seller-auth'])
      return false;
    }
    
  }
}

export const sellerAuthGuardGuard: CanActivateFn = (route, state) => {

  return inject(redirect).canActivate();
};



