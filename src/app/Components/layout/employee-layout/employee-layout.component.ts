import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { EmployeeSideBarComponent } from "../employee-side-bar/employee-side-bar.component";

@Component({
  selector: 'app-employee-layout',
  imports: [RouterModule, EmployeeSideBarComponent],
  templateUrl: './employee-layout.component.html',
  styleUrl: './employee-layout.component.css'
})
export class EmployeeLayoutComponent {

}
