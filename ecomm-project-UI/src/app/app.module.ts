import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './MyComponents/header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './MyComponents/home/home.component';
import { SellerAuthComponent } from './MyComponents/seller-auth/seller-auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SellerHomeComponent } from './MyComponents/seller-home/seller-home.component';
import { SellerAddProductComponent } from './MyComponents/seller-add-product/seller-add-product.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SellerUpdateProductComponent } from './MyComponents/seller-update-product/seller-update-product.component';
import { SearchFilterPipe } from './Pipe/search-filter.pipe';
import { SearchComponent } from './MyComponents/search/search.component';
import { ProductDetailsComponent } from './MyComponents/product-details/product-details.component';
import { UserAuthComponent } from './MyComponents/user-auth/user-auth.component';
import { JwtModule } from "@auth0/angular-jwt";
import { CartPageComponent } from './MyComponents/cart-page/cart-page.component';
import { CheckoutComponent } from './MyComponents/checkout/checkout.component';
import { MyOrdersComponent } from './MyComponents/my-orders/my-orders.component';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SellerAuthComponent,
    SellerHomeComponent,
    SellerAddProductComponent,
    SellerUpdateProductComponent,
    SearchFilterPipe,
    SearchComponent,
    ProductDetailsComponent,
    UserAuthComponent,
    CartPageComponent,
    CheckoutComponent,
    MyOrdersComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    FontAwesomeModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('access_token')
      }
    })
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
