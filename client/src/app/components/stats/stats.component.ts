import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service'

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  topSalesData = []
  uniqueSalesData = []
  daySalesSumData = []

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getStatus().subscribe((data) => {
      const { topSales, uniqueSales, daySalesSum } = data
      this.topSalesData = topSales
      this.uniqueSalesData = uniqueSales
      this.daySalesSumData = daySalesSum
    });
  }

}
