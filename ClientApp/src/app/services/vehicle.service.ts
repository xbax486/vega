import { SaveVehicle } from './../models/saveVehicle';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class VehicleService {
  private vehicleEndPoint = "/api/vehicles/";

  constructor(private http: HttpClient) { }

  getMakes(){
    return this.http.get('/api/makes').pipe(
      map(res => res)
    );
  }

  getFeatures(){
    return this.http.get('/api/features').pipe(
      map(res => res)
    );
  }

  getVehicles() {
    return this.http.get(this.vehicleEndPoint).pipe(
      map(res => res)
    );
  }

  getVehicle(id) {
    return this.http.get(this.vehicleEndPoint + id).pipe(
      map(res => res)
    );
  }

  createVehicle(vehicle) {
    return this.http.post(this.vehicleEndPoint, vehicle).pipe(
      map(res => res)
    );
  }

  updateVehicle(vehicle: SaveVehicle) {
    return this.http.put(this.vehicleEndPoint + vehicle.id, vehicle).pipe(
      map(res => res)
    );
  }

  deleteVehicle(id) {
    return this.http.delete(this.vehicleEndPoint + id).pipe(
      map(res => res)
    );
  }
}
