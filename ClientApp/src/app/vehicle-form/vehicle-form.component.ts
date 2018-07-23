import { Component, OnInit } from '@angular/core';
import { MakeService } from './../services/make.service';
import { FeatureService } from "./../services/feature.service";

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
    private makeService: MakeService, 
    private featureService: FeatureService) { }

  ngOnInit() {
    this.makeService.getMakes().subscribe((makes: any[]) => this.makes = makes);
    this.featureService.getFeatures().subscribe((features: any[]) => this.features = features);
  }

  onMakeChange(){
    var selectedMake = this.makes.find(make => make.id === +this.vehicle.make);
    this.models = selectedMake ? selectedMake.models : [];
  }

  onModelChange(){
    console.log(this.vehicle.model);
    
  }

}
