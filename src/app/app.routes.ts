import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';
import { roleGuard } from './core/guard/role.guard';
import { UserRole } from './core/model/user.model';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    {
        path: 'login',
        loadComponent: () => import('./feature/login/login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'vote',
        canActivate: [authGuard, roleGuard(UserRole.User)],
        loadComponent: () => import('./feature/vote/vote.component').then((m) => m.VoteComponent),
    },
    // TODO @willi79 will implement this later
    // {
    //     path: 'admin/results',
    //     canActivate: [authGuard, roleGuard(UserRole.Admin)],
    //     loadComponent: () =>
    //         import('./feature/admin/admin-results/admin-results.component').then((m) => m.AdminResultsComponent),
    // },
    // {
    //     path: 'admin/users',
    //     canActivate: [authGuard, roleGuard(UserRole.Admin)],
    //     loadComponent: () =>
    //         import('./feature/admin/admin-users/admin-users.component').then((m) => m.AdminUsersComponent),
    // },
    { path: '**', redirectTo: 'login' },
];
