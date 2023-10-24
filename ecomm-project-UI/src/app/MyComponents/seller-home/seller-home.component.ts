import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { addProduct } from 'src/app/models/sellerFields';
import { ProductService } from 'src/app/services/product.service';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.scss']
})
export class SellerHomeComponent {
  getProductList!: addProduct[];
  deleteIcon = faTrash;
  editIcon = faEdit

  constructor(private service: ProductService, private toatr: ToastrService) { }

  ngOnInit() {
    this.loadProduct();
  }

  deleteProduct(id: number) {
    this.service.deleteProduct(id).subscribe((result) => {
      if (result) {
        this.toatr.success("Product deleted Succssfully");
        this.loadProduct();
      }
    }, (err) => {
      console.error("Error while deleting product", err);
    })
  }

  loadProduct() {
    this.service.productList().subscribe((res) => {
      this.getProductList = res;
    });
  }
}
