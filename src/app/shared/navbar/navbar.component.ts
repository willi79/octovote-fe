import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { UserRole } from '../../core/model/user.model';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    readonly auth = inject(AuthService);
    protected readonly UserRole = UserRole;
    private readonly router = inject(Router);

    logout(): void {
        this.auth.logout();
        this.router.navigate(['/login']);
    }
}
