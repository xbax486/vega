import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class MakeService {

  constructor(private http: HttpClient) { }

  getMakes(){
    return this.http.get('/api/makes').pipe(
      map(res => res)
    );
  }
}
