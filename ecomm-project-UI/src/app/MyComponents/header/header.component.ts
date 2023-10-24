import { Component } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { addProduct } from 'src/app/models/sellerFields';
import { ProductService } from 'src/app/services/product.service';

interface TokenPayload {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier':string ;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  menyType: string = 'default';
  userId!:number | string;
  sellerName: string = '';
  userName: string = '';
  filteredString: string = '';
  searchResults: undefined | addProduct[];
  cartItem = 0;

  constructor(private router: Router, private service: ProductService) { }

  ngOnInit() {
    this.router.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('sellerToken') && val.url.includes('seller')) {
          this.menyType = "seller";

          const token = localStorage.getItem('sellerToken');
          if (token) {
            const tokenPayload = jwtDecode(token) as TokenPayload;
            this.sellerName = tokenPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
          }
          
        } else if (localStorage.getItem('userToken')){
          const token = localStorage.getItem('userToken');
          if (token) {
            const tokenPayload = jwtDecode(token) as TokenPayload;
            this.userName = tokenPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
            this.userId = tokenPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
          }
          this.service.getCartList(Number(this.userId)).subscribe((res)=>{
            this.service.cartData.emit(res);      
          });
          this.menyType = "user";
        }
        
        else {
          this.menyType = "default";
        }
      }
    });

    let cartData = localStorage.getItem('localCart');
    if(cartData) {
      this.cartItem = JSON.parse(cartData).length;
    }

    this.service.cartData.subscribe((items)=>{
      this.cartItem = items.length;
    })
  }

  logout() {
    localStorage.removeItem('sellerToken');
    this.router.navigate(['/home']);    
  }

  userLogout(){
    localStorage.removeItem('userToken');
    this.router.navigate(['/user-auth']);
    this.service.cartData.emit([]);
  }

  searchProducts(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;
      this.service.serviceFilteredString = element.value.trim(); 

      console.log(this.service.serviceFilteredString);
      
      this.filteredString = element.value.trim();
      this.service.productList().subscribe((data) => {
        if (data.length > 5) {
          //data.slice(0, 4)
         // console.log(data);
          
          //data.length = 5;
        }
        this.searchResults = data;
      })
    }
  }

  hideSearch() {
   this.searchResults = undefined;
  }

  redirectToDetails(id:number){
    this.router.navigate(['/details/'+id])
  }

  submitSearch(val: string) {
    this.router.navigate([`search/${val}`]);   
  }
}
