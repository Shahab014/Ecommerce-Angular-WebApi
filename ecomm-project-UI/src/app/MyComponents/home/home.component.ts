import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { addProduct, cart } from 'src/app/models/sellerFields';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  popularProducts!: addProduct[];
  trendyProducts: undefined | addProduct[];
  constructor(private service: ProductService, private jwtHelper: JwtHelperService) { }

  ngOnInit() {
    this.service.popularProducts().subscribe((data) => {
      this.popularProducts = data;
    })

    this.service.trendyProducts().subscribe((data) => {
      this.trendyProducts = data;
    })

    if(localStorage.getItem('userToken')) {      
      this.localCartToRemoteCart();
    }
  }

  localCartToRemoteCart() {
    let data = localStorage.getItem('localCart');
    const token = localStorage.getItem('userToken');
    let decryptToken = token && this.jwtHelper.decodeToken(token);
    let userId = decryptToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

    if (data && token) {
      let cartDataList: addProduct[] = JSON.parse(data);

      cartDataList.forEach((product: addProduct, index) => {
        let cartData: cart = {
          ...product,
          productId: product.id,
          userId
        };
        delete cartData.id;

        this.service.addToCart(cartData).subscribe((result) => {
          if (result) {
            console.log("data added successfully");
          }
        })
        if (cartDataList.length === index + 1) {
          localStorage.removeItem('localCart');
        }
      });

    }

    this.service.getCartList(userId).subscribe((res)=>{
      this.service.cartData.emit(res);      
    })
  }

}
