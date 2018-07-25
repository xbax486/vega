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

  vehicle: any = {
    vehicleFeatureIds: [],
    contactResource: {}
  };

  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
    this.vehicleService.getMakes().subscribe((makes: any[]) => this.makes = makes);
    this.vehicleService.getFeatures().subscribe((features: any[]) => this.features = features);
  }

  onMakeChange() {
    var selectedMake = this.makes.find(make => make.id === +this.vehicle.makeId);
    this.models = selectedMake ? selectedMake.models : [];
    delete this.vehicle.modelId;
  }

  onModelChange() {
    console.log(this.vehicle.modelId);
  }

  onFeatureToggle(featureId, $event) {
    if($event.target.checked) {
      this.vehicle.vehicleFeatureIds.push(featureId);
    }
    else {
      this.vehicle.vehicleFeatureIds.splice(this.vehicle.vehicleFeatureIds.indexOf(featureId), 1);
    }
  }

  submit() {
    this.vehicleService.createVehicle(this.vehicle)
      .subscribe(x => console.log(x));
  }
}
