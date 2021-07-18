import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  productsData = []
  cartProducts = []

  sessionId = Math.ceil(Math.random() * 1000000000)
  cartProductsCount = 0
  totalPrice = 0


  isCart = false

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getProducts().subscribe((data) => {
      this.productsData = data
    });
  }

  addToCart(p): void {
    this.adminService.postProductToCart(p.id, this.sessionId).subscribe(({ success }) => {
      if (success) {
        this.totalPrice += p.price
        this.cartProducts.push(p)
        this.cartProductsCount = this.cartProducts.length
      }
    });
  }

  payCart(): void {
    this.adminService.postPayCart(this.sessionId).subscribe(({ success }) => {
      if (success) {
        this.cartProducts = []
        this.isCart = false
        this.cartProductsCount = 0
        this.totalPrice = 0
      }
    });
  }
}
