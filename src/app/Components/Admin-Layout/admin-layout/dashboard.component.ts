import { Component } from '@angular/core';
import { AdminSideBarComponent } from "./admin-side-bar/admin-side-bar.component";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  imports: [AdminSideBarComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
