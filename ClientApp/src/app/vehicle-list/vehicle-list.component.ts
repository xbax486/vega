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
  private readonly PAGE_SIZE = 3;

  vehicles: Vehicle[];
  makes: KeyValuePair[];
  queryResult: any = {};
  query: any = {
    pageSize: this.PAGE_SIZE
  };
  columns = [
    { title: 'Id' },
    { title: 'Make', key: 'make', isSortable: true },
    { title: 'Model', key: 'model', isSortable: true },
    { title: 'Contact Name', key: 'contactName', isSortable: true },
    {}
  ];

  constructor(private vehicleService: VehicleService) { }

  private populateVehicleList() {
    this.vehicleService.getVehicles(this.query)
      .subscribe(queryResult => this.queryResult = queryResult);
  }

  ngOnInit() {
    this.vehicleService.getMakes()
      .subscribe(returnedMakes => {
        let makes = returnedMakes as KeyValuePair[];
        this.makes = makes;
      });

    this.populateVehicleList();
  }

  onFilterChange() {
    this.query.page = 1; 
    this.populateVehicleList();
  }

  resetFilter() {
    this.query = {
      page: 1,
      pageSize: this.PAGE_SIZE
    };
    this.onFilterChange();
  }

  sortBy(columnName) {
    if (this.query.sortBy === columnName)
      this.query.isSortAscending = !this.query.isSortAscending;
    else {
      this.query.sortBy = columnName;
      this.query.isSortAscending = true;
    }
    
    this.populateVehicleList();
  }

  onPageChange(page) {
    this.query.page = page; 
    this.populateVehicleList();
  }
}
