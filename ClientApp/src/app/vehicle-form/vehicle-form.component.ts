import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../services/vehicle.service';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from "rxjs/observable/forkJoin";
import { SaveVehicle } from "../models/saveVehicle";
import { Vehicle } from "../models/vehicle";
import * as _ from "underscore";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  makes;
  models: any[];
  features;

  vehicle: SaveVehicle = {
    id: 0,
    makeId: 0,
    modelId: 0,
    isRegistered: false,
    vehicleFeatureIds: [],
    contactResource: {
      name: '',
      phone: '',
      email: ''
    }
  };

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService) {
    this.activatedRoute.params.subscribe(param => {
      let id = +param['id'];
      this.vehicle.id = !isNaN(id) ? id : this.vehicle.id;
    });
  }

  ngOnInit() {
    var sources = [
      this.vehicleService.getMakes(),
      this.vehicleService.getFeatures()
    ];

    if (this.vehicle.id) {
      sources.push(this.vehicleService.getVehicle(this.vehicle.id));
    }

    forkJoin(sources)
      .subscribe(data => {
        this.makes = data[0];
        this.features = data[1];

        if (this.vehicle.id) {
          let vehicle = data[2] as Vehicle;
          this.setVehicle(vehicle);
          this.populateModels();
        }
      },
        error => {
          if (error.status == 404)
            this.router.navigate(['']);
        });
  }

  private setVehicle(vehicle: Vehicle) {
    this.vehicle.id = vehicle.id;
    this.vehicle.makeId = vehicle.makeResource.id;
    this.vehicle.modelId = vehicle.modelResource.id;
    this.vehicle.isRegistered = vehicle.isRegistered;
    this.vehicle.contactResource = vehicle.contactResource;
    this.vehicle.vehicleFeatureIds = _.pluck(vehicle.featureResources, 'id');
  }

  private populateModels() {
    var selectedMake = this.makes.find(make => make.id === +this.vehicle.makeId);
    this.models = selectedMake ? selectedMake.models : [];
  }

  onMakeChange() {
    this.populateModels();
    delete this.vehicle.modelId;
  }

  onModelChange() {
    console.log(this.vehicle.modelId);
  }

  onFeatureToggle(featureId, $event) {
    if ($event.target.checked) {
      this.vehicle.vehicleFeatureIds.push(featureId);
    }
    else {
      this.vehicle.vehicleFeatureIds.splice(this.vehicle.vehicleFeatureIds.indexOf(featureId), 1);
    }
  }

  submit() {
    var result$ = this.vehicle.id ?
      this.vehicleService.updateVehicle(this.vehicle) : this.vehicleService.createVehicle(this.vehicle);
    result$.subscribe(returnedVehicle => {
      this.toastrService.success('Data was sucessfully saved.!', 'Success', {
        closeButton: true,
        timeOut: 5000
      });

      let vehicle = returnedVehicle as Vehicle;
      console.log(vehicle);
      
      this.router.navigate(['/vehicles/', vehicle.id]);
    });
  }
}
