import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class PhotoService {

  constructor(
    private http: HttpClient) { }

  // uploadPhoto(vehicleId, photo) {
  //   var formData = new FormData();
  //   formData.append('file', photo);
  //   return this.http.post(`/api/vehicles/${vehicleId}/photos`, formData).pipe(
  //     map(res => res)
  //   );
  // }

  uploadPhoto(vehicleId, photo) {
    var formData = new FormData();
    formData.append('file', photo);

    const req = new HttpRequest('POST', `/api/vehicles/${vehicleId}/photos`, formData, {reportProgress: true});

    return this.http.request(req).pipe(
      map(res => res)
    );
  }

  getPhotos(vehicleId) {
    return this.http.get(`/api/vehicles/${vehicleId}/photos`).pipe(
      map(res => res)
    );
  }
}
