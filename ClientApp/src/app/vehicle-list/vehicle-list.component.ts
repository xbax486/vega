import { KeyValuePair } from './../models/keyValuePair';
import { VehicleService } from './../services/vehicle.service';
import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../models/vehicle';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[];
  makes: KeyValuePair[];
  filter: any = {};
  
  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
    this.vehicleService.getMakes()
      .subscribe(returnedMakes => {
        let makes = returnedMakes as KeyValuePair[];
        this.makes = makes;
      });

    this.populateVehicleList();
  }

  private populateVehicleList() {
    this.vehicleService.getVehicles(this.filter)
      .subscribe(returnedVehicles => {
        let vehicles = returnedVehicles as Vehicle[];
        this.vehicles = vehicles;
      });
  }

  onFilterChange() {
    this.populateVehicleList();
  }

  resetFilter() {
    this.filter = {};
    this.onFilterChange();
  }
}
