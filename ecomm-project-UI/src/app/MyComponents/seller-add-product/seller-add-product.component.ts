import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { addProduct } from 'src/app/models/sellerFields';
import { ProductService } from 'src/app/services/product.service';


// export type Form = {
//   avatar: string,
//   ProductName: string,
//   ProductPrice: number,
//   color: string,
//   category: string,
//   description: string
// }


@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.scss']
})
export class SellerAddProductComponent {

  uploadForm = this.createForm({} as addProduct);
  base64Image: string | null = null;

  constructor(private services: ProductService, private fb: FormBuilder, private toatr: ToastrService) { }

  onInit() {
    this.uploadForm = this.createForm({} as addProduct)
  }

  async showPreview(event: any) {
    const file = (event.target).files[0];

    const base64image = await this.getBase64(file);
    if (base64image) {
      this.uploadForm.patchValue({
        avatar: base64image
      })
    }
    //console.log(base64image); 
  }

  // Submit Form
  submit() {
    // console.log(this.uploadForm.value);
    this.services.addProduct(this.uploadForm.value).subscribe((res) => {
      this.toatr.success("Product Added Successfully");
      this.uploadForm.reset();
    }, (err) => {
      console.error("Error while adding product", err);
    });
  }


  createForm(form: addProduct) {
    return this.fb.group({
      avatar: [''],
      ProductName: [form.ProductName],
      ProductPrice: [form.ProductPrice],
      color: [form.Color],
      category: [form.Category],
      description: [form.Description]
    })
  }

  async getBase64(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = String(reader.result);
          resolve(base64Image)
        }
        reader.readAsDataURL(file)
      } catch (err: any) {
        reject("Error while reading!!!")
      }
    })

  }
}
