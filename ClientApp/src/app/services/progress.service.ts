import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BrowserXhr } from '@angular/http';

@Injectable()
export class ProgressService {
  uploadProgress: Subject<any> = new Subject();
  downloadProgress: Subject<any> = new Subject();

  constructor() { }
}

@Injectable()
export class BrowserXhrWithProgressService extends BrowserXhr{

  constructor(private progressService: ProgressService) { super(); }
  
  private creareProgress(event) {
    return {
      total: event.total,
      percentage: Math.round(event.loaded / event.total * 100)
    };
  }

  build(): XMLHttpRequest {
    var xhr: XMLHttpRequest = super.build();

    xhr.onprogress = (event) => {
      this.progressService.downloadProgress.next(this.creareProgress(event));
    };
  
    xhr.upload.onprogress = (event) => {
      this.progressService.uploadProgress.next(this.creareProgress(event));
    };

    return xhr;
  }
}