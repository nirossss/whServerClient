import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service'


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  productsData = []

  newProduct = {
    id: 0,
    title: '',
    price: 0,
    description: '',
    image: ''
  }
  editProductData = {
    id: 0,
    title: '',
    price: 0,
    description: '',
    image: ''
  }

  isAdd = false
  isEdit = false

  constructor(
    private router: Router,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.adminService.getProducts().subscribe((data) => {
      this.productsData = data
    });
  }

  cancelAdd(): void {
    this.newProduct = {
      id: 0,
      title: '',
      price: 0,
      description: '',
      image: ''
    }
    this.isAdd = false
  }

  cancelEdit(): void {
    this.editProductData = {
      id: 0,
      title: '',
      price: 0,
      description: '',
      image: ''
    }
    this.isEdit = false
  }

  saveAdd(): void {
    this.adminService.postNewProduct(this.newProduct).subscribe(({ success, product_id }) => {
      if (success) {
        this.newProduct.id = product_id
        this.productsData.push(this.newProduct)
        this.cancelAdd()
      } else if (!success) {
        this.cancelAdd()
      }
    });
  }

  editProductForm(p): void {
    this.editProductData = p
    this.isEdit = true
  }

  saveEdit(): void {
    this.adminService.postEditProduct(this.editProductData).subscribe(({ success }) => {
      if (success) {
        this.cancelEdit()
      } else if (!success) {
        this.cancelEdit()
      }
    });
  }

  deleteProduct(id): void {
    this.adminService.postDeleteProduct(id).subscribe(({ success }) => {
      if (success) {
        for (let i = 0; i < this.productsData.length; i++) {
          if (this.productsData[i].id === id) {
            this.productsData.splice(i, 1)
          }
        }
        return
      }
    });
  }

}
