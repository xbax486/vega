import { PhotoService } from '../../services/photo/photo.service';
import { VehicleService } from '../../services/vehicle/vehicle.service';
import { Component, OnInit, ViewChild, ElementRef, Inject, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProgressService } from '../../services/progress/progress.service';
import { HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';

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
    @Inject(Injector) private injector: Injector,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private photoService: PhotoService,
    private progressService: ProgressService,
    private authService: AuthService) {
    this.activatedRoute.params.subscribe(param => {
      this.vehicleId = +param['id'];
      if (isNaN(this.vehicleId) || this.vehicleId <= 0) {
        this.router.navigate(['/vehicles']);
        return;
      }
    });
  }

  // Need to get ToastrService from injector rather than constructor injection to avoid cyclic dependency error
  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
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
    var file = nativeElement.files[0];
    nativeElement.value = '';

    this.photoService.uploadPhoto(this.vehicleId, file)
      .subscribe(
        event => {
          this.progress = this.progressService.checkProgress(event);

          if (event.type === HttpEventType.Response) {
            this.photos.push(this.progress.photo);
            this.progress = null;
          }
        },
        error => {
          this.toastrService.error(error.error, 'Error', {
            closeButton: true,
            timeOut: 5000
          });
        }
      );
  }
}
