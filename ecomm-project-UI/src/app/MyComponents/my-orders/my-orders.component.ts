import { Component } from '@angular/core';
import { order } from 'src/app/models/sellerFields';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent {
  orderData!:order[];
  constructor(private service:ProductService){}

  ngOnInit(){
    this.getOrderList();
  }

  cancelOrder(orderId:number|undefined) {
    orderId && this.service.cancelOrder(orderId).subscribe((res)=>{
      this.getOrderList();
    })
  }

  getOrderList(){
    this.service.orderList().subscribe((res)=>{
      this.orderData = res
    })
  }
}
