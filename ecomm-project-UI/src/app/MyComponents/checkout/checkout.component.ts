import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { cart, order } from 'src/app/models/sellerFields';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  
 totalPrice!:number
 quantity:number = 0;
  constructor(private service:ProductService, private jwtHelper: JwtHelperService, private router:Router,
    private taostr: ToastrService){}

  ngOnInit(){
    this.service.currentCartItem().subscribe((res)=>{
      
      let price = 0;
      res.forEach((item:cart)=>{
        if(item.quantity) {         
         // this.quantity = item.quantity;
          price = price + (item.ProductPrice * item.quantity);
        }
      });
    
      this.totalPrice =  price + (price / 10) + 40 - (price / 10);
      
      
    });
  }

  orderNow(data:{email:string, address:string, contact:string}){
    const token = localStorage.getItem('userToken');
    let decryptToken = token && this.jwtHelper.decodeToken(token);
    let userId = decryptToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

    this.service.deleteCartItem(userId); //deleting all the cart item

    if(this.totalPrice){
      let orderData:order = {
        ...data,
        totalPrice : this.totalPrice,
        userId
      }
      this.service.orderNow(orderData).subscribe((res)=>{
        if(res){
          this.taostr.success("Order has been placed")
          setTimeout(()=>{
            this.router.navigate(['/my-orders'])
          },4000)
        }
      },(err:any)=>{
        console.log(err);
        
      })
    }
    
  }
}
