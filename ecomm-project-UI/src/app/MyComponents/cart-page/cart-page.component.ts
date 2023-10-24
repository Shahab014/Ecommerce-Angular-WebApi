import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { cart, priceSummary } from 'src/app/models/sellerFields';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent {
  totalData = 0
  quantity: number = 0;
  cartData: cart[] | undefined;
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  };

  constructor(private service: ProductService, private jwtHelper: JwtHelperService, private router: Router) { }

  ngOnInit() {
    this.showCartProduct();
  }

  showCartProduct() {
    this.service.currentCartItem().subscribe((res) => {
      this.cartData = res;
      let price = 0;
      res.forEach((item) => {
        if (item.quantity) {
          this.quantity = item.quantity;
          price = price + (item.ProductPrice * this.quantity);
        }
      });

      this.totalData = this.cartData.length;
      this.priceSummary.price = price;
      this.priceSummary.discount = price / 10;
      this.priceSummary.tax = price / 10;
      this.priceSummary.delivery = 40;
      this.priceSummary.total = price + (price / 10) + 40 - (price / 10);

      if (!this.cartData.length) {
        this.router.navigate(['/home'])
      }
    });
  }

  removeToCart(cartId: number | undefined) {
    let user = localStorage.getItem('userToken');
    let decryptToken = user && this.jwtHelper.decodeToken(user);
    let userId = decryptToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]

    cartId && this.cartData && this.service.removeFromCart(cartId)
      .subscribe((result) => {
        this.showCartProduct();
        if(this.cartData){
          this.totalData = this.cartData.length
        }
        this.service.getCartList(userId).subscribe((res) => {
          this.service.cartData.emit(res);

        })
      })
  }

}
