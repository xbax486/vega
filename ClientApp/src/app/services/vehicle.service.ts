import { SaveVehicle } from './../models/saveVehicle';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class VehicleService {

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

  createVehicle(vehicle) {
    return this.http.post("/api/vehicles", vehicle).pipe(
      map(res => res)
    );
  }

  getVehicle(id) {
    return this.http.get("/api/vehicles/" + id).pipe(
      map(res => res)
    );
  }

  updateVehicle(vehicle: SaveVehicle) {
    return this.http.put("/api/vehicles/" + vehicle.id, vehicle).pipe(
      map(res => res)
    );
  }
}
