import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './MyComponents/home/home.component';
import { SellerAuthComponent } from './MyComponents/seller-auth/seller-auth.component';
import { SellerHomeComponent } from './MyComponents/seller-home/seller-home.component';
import { sellerAuthGuardGuard } from './services/seller-auth-guard.guard';
import { SellerAddProductComponent } from './MyComponents/seller-add-product/seller-add-product.component';
import { SellerUpdateProductComponent } from './MyComponents/seller-update-product/seller-update-product.component';
import { SearchComponent } from './MyComponents/search/search.component';
import { ProductDetailsComponent } from './MyComponents/product-details/product-details.component';
import { UserAuthComponent } from './MyComponents/user-auth/user-auth.component';
import { CartPageComponent } from './MyComponents/cart-page/cart-page.component';
import { CheckoutComponent } from './MyComponents/checkout/checkout.component';
import { MyOrdersComponent } from './MyComponents/my-orders/my-orders.component';



const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'seller-auth', component: SellerAuthComponent },
  { path: 'seller-home', component: SellerHomeComponent, canActivate: [sellerAuthGuardGuard] },
  { path: 'seller-add-product', component: SellerAddProductComponent },
  { path: 'seller-update-product/:id', component: SellerUpdateProductComponent, canActivate: [sellerAuthGuardGuard] },
  { path: 'search/:query', component: SearchComponent },
  { path: 'details/:productId', component: ProductDetailsComponent },
  { path: 'user-auth', component: UserAuthComponent },
  { component: CartPageComponent, path: 'cart-page' },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
