import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    return this.http.get(`http://localhost:3000/api/products`, httpOptions);
  }

  postNewProduct(data): Observable<any> {
    return this.http.post('http://localhost:3000/api/products', data, httpOptions);
  }

  postEditProduct(data): Observable<any> {
    return this.http.post('http://localhost:3000/api/editProduct', data, httpOptions);
  }

  postDeleteProduct(id): Observable<any> {
    return this.http.post('http://localhost:3000/api/deleteProduct', {
      id: id
    }, httpOptions);
  }

  postProductToCart(pId, cId): Observable<any> {
    return this.http.post('http://localhost:3000/api/productToCart', {
      product_id: pId,
      cart_id: cId
    }, httpOptions);
  }

  postPayCart(cart_id): Observable<any> {
    return this.http.post('http://localhost:3000/api/payCart', {
      cart_id: cart_id
    }, httpOptions);
  }

  getStatus(): Observable<any> {
    return this.http.get(`http://localhost:3000/api/stats`, httpOptions);
  }
}
