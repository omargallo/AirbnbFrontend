import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HostPropertiesService } from '../../core/services/Property/HostPropertiesService';
import { AuthService } from '../../core/services/auth.service';
import { map, catchError, of, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

export const HasListingGuard: CanActivateFn = () => {
  const router = inject(Router);
  const hostPropertiesService = inject(HostPropertiesService);
  const authService = inject(AuthService);
  const snackBar = inject(MatSnackBar);
  const translate = inject(TranslateService);

  const hostId = authService.userId;

  if (!hostId) {
    return of(router.createUrlTree(['/']));
  }

  return hostPropertiesService.getPropertiesByHostId(hostId).pipe(
    map((properties) => {
      if (properties && properties.length > 0) {
        return true;
      } else {
        const message = translate.instant('HOME.TOAST.NEED_TO_CREATE_LISTING');
        const action = translate.instant('HOME.TOAST.OK');

        snackBar.open(message, action, {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        return router.createUrlTree(['/host']);
      }
    }),
    catchError((err) => {
      console.error('❌ HasListingGuard error:', err);
      return of(router.createUrlTree(['/']));
    })
  );
};
