import { ErrorHandler, Inject, Injector } from "@angular/core";
import { ToastrService } from 'ngx-toastr';

export class AppErrorHandler implements ErrorHandler {
    constructor(@Inject(Injector) private injector: Injector) {}

    // Need to get ToastrService from injector rather than constructor injection to avoid cyclic dependency error
    private get toastrService(): ToastrService {
        return this.injector.get(ToastrService);
    }

    handleError(error: any): void {
        console.log("ERROR");
        this.toastrService.error(error.statusText, 'Error', {
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        });
    }
}