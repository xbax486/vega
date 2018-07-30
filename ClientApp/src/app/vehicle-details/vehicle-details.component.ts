import { PhotoService } from './../services/photo.service';
import { VehicleService } from './../services/vehicle.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProgressService } from '../services/progress.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailsComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  vehicle: any;
  vehicleId: number;
  photos: any[];
  progress: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private photoService: PhotoService,
    private progressService: ProgressService) {
    this.activatedRoute.params.subscribe(param => {
      this.vehicleId = +param['id'];
      if (isNaN(this.vehicleId) || this.vehicleId <= 0) {
        this.router.navigate(['/vehicles']);
        return;
      }
    });
  }

  ngOnInit() {
    this.photoService.getPhotos(this.vehicleId)
      .subscribe(
        (photos: any[]) => this.photos = photos
      );

    this.vehicleService.getVehicle(this.vehicleId)
      .subscribe(
        vehicle => this.vehicle = vehicle,
        error => {
          if (error.status == 404) {
            this.router.navigate(['/vehicles']);
            return;
          }
        }
      );
  }

  delete() {
    if (confirm("Are you sure to delete the vehicle?")) {
      this.vehicleService.deleteVehicle(this.vehicle.id)
        .subscribe(x => {
          this.router.navigate(['']);
        });
    }
  }

  uploadPhoto() {
    var nativeElement: HTMLInputElement = this.fileInput.nativeElement;

    this.photoService.uploadPhoto(this.vehicleId, nativeElement.files[0])
      .subscribe(event => {
        this.progress = this.progressService.checkProgress(event);
        
        if(event.type === HttpEventType.Response) {
          this.photos.push(this.progress.photo);
          this.progress = null;  
        }
      });
  }
}
