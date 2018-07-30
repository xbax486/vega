import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class PhotoService {

  constructor(private http: HttpClient) { }

  uploadPhoto(vehicleId, photo){
    var formData = new FormData();
    formData.append('file', photo);
    return this.http.post(`/api/vehicles/${vehicleId}/photos`, formData).pipe(
      map(res => res)
    );
  }
}
