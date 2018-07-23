import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../services/vehicle.service';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  makes: any[];
  models: any[];
  features: any[];
  vehicle: any = {};

  constructor(
    private vehicleService: VehicleService) { }

  ngOnInit() {
    this.vehicleService.getMakes().subscribe((makes: any[]) => this.makes = makes);
    this.vehicleService.getFeatures().subscribe((features: any[]) => this.features = features);
  }

  onMakeChange(){
    var selectedMake = this.makes.find(make => make.id === +this.vehicle.make);
    this.models = selectedMake ? selectedMake.models : [];
  }

  onModelChange(){
    console.log(this.vehicle.model);
    
  }

}
