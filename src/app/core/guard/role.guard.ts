import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { UserRole } from '../model/user.model';

export function roleGuard(role: UserRole): CanActivateFn {
    return () => {
        const auth = inject(AuthService);
        const router = inject(Router);

        if (!auth.isLoggedIn()) {
            router.navigate(['/login']);
            return false;
        }

        if (auth.currentUser()?.role !== role) {
            router.navigate(['/vote']);
            return false;
        }

        return true;
    };
}
