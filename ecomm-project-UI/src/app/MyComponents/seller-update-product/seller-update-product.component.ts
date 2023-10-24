import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { addProduct } from 'src/app/models/sellerFields';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.scss']
})

export class SellerUpdateProductComponent {
  uploadForm = this.createForm({} as addProduct);
  productData: addProduct = {} as addProduct;

  ngOnInit() {
    let productId = this.route.snapshot.paramMap.get('id');
    productId && this.service.getProduct(productId).subscribe((data) => {
      this.productData = data[0];

      // console.log(this.productData);

      this.uploadForm = this.createForm(this.productData!);

    })
  }

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private service: ProductService,
    private toastr: ToastrService, private router: Router) { }

  createForm(form: addProduct) {
    return this.fb.group({
      id: [form.id],
      avatar: [form.avatar],
      ProductName: [form.ProductName],
      ProductPrice: [form.ProductPrice],
      color: [form.Color],
      category: [form.Category],
      description: [form.Description]
    })
  }

  async showPreview(data: any) {
    const file = (data.target).files[0];
    const base64Image = await this.getBase64(file);
    if (base64Image) {
      this.uploadForm.patchValue({
        avatar: base64Image
      })
    }
  }

  submit() {
    this.service.updateProduct(this.uploadForm.value).subscribe((res) => {
      if (this.productData) {
        this.uploadForm.patchValue({
          id: this.productData.id
        })
      }
      this.toastr.success("Product Added Successfully");
      this.router.navigate(['/seller-home']);
    }, (err) => {
      console.error("Error while adding product", err);
    });
  }

  getBase64(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = String(reader.result);
          resolve(base64Image);
        }
        reader.readAsDataURL(file);
      } catch (err) {
        reject(err);
      }
    })
  }

}
