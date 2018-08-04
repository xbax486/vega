import { Injectable } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Injectable()
export class ProgressService {
  private progress = {
    percentage: 0,
    photo: {}
  };

  checkProgress(event: HttpEvent<{}>) {
    if (event.type === HttpEventType.UploadProgress) {
      let percentage = Math.round(event.loaded / event.total * 100);
      this.progress.percentage = percentage;
    }
    else if (event.type === HttpEventType.Response) {
      this.progress.photo = event.body;
    }

    return this.progress;
  }
}