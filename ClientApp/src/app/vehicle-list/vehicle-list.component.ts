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
  allVehicles: Vehicle[];
  makes: KeyValuePair[];
  filter: any = {};
  
  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
    this.vehicleService.getMakes()
      .subscribe(returnedMakes => {
        let makes = returnedMakes as KeyValuePair[];
        this.makes = makes;
      });

    this.vehicleService.getVehicles()
      .subscribe(returnedVehicles => {
        let vehicles = returnedVehicles as Vehicle[];
        this.vehicles = this.allVehicles = vehicles;
      });
  }

  onFilterChange() {
    var vehicles = this.allVehicles;

    if(this.filter.makeId)
      vehicles = this.allVehicles.filter(v => v.makeResource.id == this.filter.makeId);
    
    this.vehicles = vehicles;
  }

  resetFilter() {
    this.filter = {};
    this.onFilterChange();
  }
}
