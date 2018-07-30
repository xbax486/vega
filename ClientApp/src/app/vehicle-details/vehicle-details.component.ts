import { VehicleService } from './../services/vehicle.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailsComponent implements OnInit {
  vehicle: any;
  vehicleId: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService) {
    this.activatedRoute.params.subscribe(param => {
      this.vehicleId = +param['id'];
      if (isNaN(this.vehicleId) || this.vehicleId <= 0) {
        this.router.navigate(['/vehicles']);
        return;
      }
    });
  }

  ngOnInit() {
    this.vehicleService.getVehicle(this.vehicleId)
      .subscribe(
        vehicle => this.vehicle = vehicle,
        error => {
          if (error.status == 404) {
            this.router.navigate(['/vehicles']);
            return;
          }
        }
      );
  }

  delete() {
    if(confirm("Are you sure to delete the vehicle?")) {
      this.vehicleService.deleteVehicle(this.vehicle.id)
        .subscribe(x => {
          this.router.navigate(['']);
        });
    }
  }

}