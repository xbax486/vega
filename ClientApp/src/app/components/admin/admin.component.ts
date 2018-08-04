import { map, flatMap } from 'rxjs/operators';
import { forkJoin } from "rxjs/observable/forkJoin";
import { VehicleService } from './../../services/vehicle/vehicle.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  sources = [];

  data = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"]
      }
    ]
  };

  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
    this.getVehiclesByMake();
  }

  getVehiclesByMake() {
    this.vehicleService.getMakes()
      .pipe(
        map((makes: object[]) => this.getVehiclesObserables(makes)),
        flatMap(sources => forkJoin(sources))
      )
      .subscribe(
        vehicleGroups => {
          vehicleGroups.forEach(vehicleGroup => {
            this.data.datasets[0].data.push(vehicleGroup['total']);
            this.data.labels.push(vehicleGroup['items'][0]['makeResource']['name']);
          });
        }
      );
  }

  private getVehiclesObserables(makes) {
    makes.forEach(make => {
      this.sources.push(this.vehicleService.getVehicles({ makeId: make['id'] }));
    });
    return this.sources;
  }
}