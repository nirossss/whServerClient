import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component'
import { HomeComponent } from './components/home/home.component';
import { StatsComponent } from './components/stats/stats.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent },
  { path: 'home', component: HomeComponent },
  { path: 'stats', component: StatsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
