import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { faL } from '@fortawesome/free-solid-svg-icons';
import jwtDecode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { addProduct, cart } from 'src/app/models/sellerFields';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  productData: addProduct = {} as addProduct;
  cartData!: addProduct; 
  productQuantity: number = 1;
  quantiy: number = 1;
  removeCart = false;

  constructor(private activeRoute: ActivatedRoute, private service: ProductService,
    private jwtHelper: JwtHelperService, private router:Router, private toastr: ToastrService) { }

  ngOnInit() {
    let productId = this.activeRoute.snapshot.paramMap.get('productId');
    productId && this.service.getProduct(productId).subscribe((data) => {
      this.productData = data[0];

      let cartData = localStorage.getItem('localCart');
      if (productId && cartData) {
        let items = JSON.parse(cartData);
        items = items.filter((item: addProduct) => productId == item.id.toString())
        if (items.length) {
          this.removeCart = true;
        } else {
          this.removeCart = false;
        }
      }

      let user = localStorage.getItem('userToken');
      let decryptToken = user && this.jwtHelper.decodeToken(user);
      if(user){
        let userId = decryptToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
        this.service.getCartList(userId).subscribe((result) => {
          this.service.cartData.emit(result);
        });
        this.service.cartData.subscribe((result)=>{
          let item = result.filter((item: addProduct)=> productId == item.productId?.toString())
          if(item.length) {
            this.cartData = item[0];
            this.removeCart = true;
          }
        })
      }


    })
  }

  handleQuantity(val: string) {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }
  }


  AddToCart() {
    if (this.productData) {
      this.productData.quantity = this.productQuantity;
      if (!localStorage.getItem('userToken')) {
        this.service.localAddToCart(this.productData);
        this.removeCart = true;
      } else {
        let user = localStorage.getItem('userToken');
        let decryptToken = user && this.jwtHelper.decodeToken(user);

        let userId = decryptToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]

        userId = this.ConvertStringToNumber(userId)

        let cartData: cart = {
          ...this.productData,
          userId,
          productId: this.productData.id
        }
        delete cartData.id;
        this.service.addToCart(cartData).subscribe((data) => {
          if (data) {
            this.service.getCartList(userId).subscribe((result) => {
              this.service.cartData.emit(result);
            });
            this.removeCart = true;
          }
        })

      }
    }
  }

  removeFromCart(productId: number) {
    if(!localStorage.getItem('userToken')) {
      this.service.removeItemFromCart(productId);
      
    } else {
      let user = localStorage.getItem('userToken');
      let decryptToken = user && this.jwtHelper.decodeToken(user);

      let userId = decryptToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
      this.cartData && this.service.removeFromCart(this.cartData.id)
      .subscribe((result)=>{
        this.service.getCartList(userId).subscribe((res)=>{
          this.service.cartData.emit(res);
        })
      })
    }
    this.removeCart = false;
    
  }

  ConvertStringToNumber(input: string) {
    if (input.trim().length == 0) {
      return NaN;
    }
    return Number(input);
  }

  buyNow(){
    if(!localStorage.getItem('userToken')){
      this.toastr.info('Sign in to buy products')
      this.router.navigate(['/user-auth'])
      this.AddToCart();
    } else {
      this.AddToCart();
      this.router.navigate(['/cart-page'])
    }
  }
}


