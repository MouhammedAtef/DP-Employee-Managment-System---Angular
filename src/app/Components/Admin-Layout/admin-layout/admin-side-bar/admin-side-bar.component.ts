import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-side-bar',
  imports: [RouterModule],
  templateUrl: './admin-side-bar.component.html',
  styleUrl: './admin-side-bar.component.css'
})
export class AdminSideBarComponent {
  constructor(private router: Router) {
    
  }
  onSignOut() {
  //Clear local storage 
  localStorage.clear();

  //navigate to login page
  this.router.navigate(['/login']);
}
}
