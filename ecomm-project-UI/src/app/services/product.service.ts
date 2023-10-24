import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { addProduct, cart, order } from '../models/sellerFields';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  cartData = new EventEmitter<addProduct[] | []>();

  serviceFilteredString: string = '';

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  addProduct(data: any): Observable<addProduct[]> {
    return this.http.post<addProduct[]>(`${environment.apiUrl}/seller-add-product`, data);
  }

  productList() {
    return this.http.get<addProduct[]>(`${environment.apiUrl}/seller-product-list`);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${environment.apiUrl}/seller-delete-product/${id}`);
  }

  getProduct(id: string) {
    return this.http.get<addProduct[]>(`${environment.apiUrl}/seller-getProduct/${id}`)
  }

  updateProduct(product: any) {
    return this.http.put<addProduct>(`${environment.apiUrl}/seller-update-product/${product.id}`, product);
  }

  popularProducts() {
    return this.http.get<addProduct[]>(`${environment.apiUrl}/limited-Products`)
  }

  trendyProducts() {
    return this.http.get<addProduct[]>(`${environment.apiUrl}/limited-trendyProducts`)
  }

  searchProduct(query: string) {
    return this.http.get<addProduct[]>(`${environment.apiUrl}/`);
  }

  localAddToCart(data: addProduct) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]))
      this.cartData.emit([data]);
    } else {
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData))
      this.cartData.emit(cartData);
    }
  }

  removeItemFromCart(productId: number) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: addProduct[] = JSON.parse(cartData);
      items = items.filter((item: addProduct) => productId !== item.id);
      localStorage.setItem('localCart', JSON.stringify(items))
      this.cartData.emit(items);
    }
  }

  addToCart(cartData: cart) {
    return this.http.post<cart>(`${environment.apiUrl}/addToCart`, cartData);
  }

  getCartList(userId: number) {
    return this.http.get<addProduct[]>(`${environment.apiUrl}/cart/${userId}`)
  }

  removeFromCart(cartId: number) {
    return this.http.delete<cart>(`${environment.apiUrl}/remove-item-from-cart/${cartId}`)
  }

  currentCartItem() {
    let user = localStorage.getItem('userToken');
    let decryptToken = user && this.jwtHelper.decodeToken(user);

    let userId = decryptToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    return this.http.get<cart[]>(`${environment.apiUrl}/cart/${userId}`);
  }

  orderNow(data: order) {
    return this.http.post<order[]>(`${environment.apiUrl}/orders`, data);
  }

  orderList() {
    let user = localStorage.getItem('userToken');
    let decryptToken = user && this.jwtHelper.decodeToken(user);

    let userId = decryptToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    return this.http.get<order[]>(`${environment.apiUrl}/orderList/${userId}`);
  }

  deleteCartItem(userId: number) {
    return this.http.delete(`${environment.apiUrl}/deleteCartItem/${userId}`)
      .subscribe((res) => {
        if (res) {
          this.cartData.emit([])
        }
      });
  }

  cancelOrder(orderId:number){
    return this.http.delete(`${environment.apiUrl}/cancelOrder/${orderId}`)
  }
}
