import { Component, inject, OnInit, signal } from '@angular/core';

import { UserService } from '../../../core/service/user.service';
import { User, UserRole } from '../../../core/model/user.model';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [],
    templateUrl: './admin-users.component.html',
    styleUrl: './admin-users.component.scss',
})
export class AdminUsersComponent implements OnInit {
    readonly users = signal<User[]>([]);
    readonly isLoading = signal(true);
    readonly errorMessage = signal<string | null>(null);
    readonly busyUserId = signal<string | null>(null);
    private readonly userService = inject(UserService);

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.isLoading.set(true);
        this.userService.list().subscribe({
            next: (res) => {
                this.users.set(res.users);
                this.isLoading.set(false);
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.message || 'Could not load users.');
            },
        });
    }

    toggleRole(user: User): void {
        const nextRole: UserRole = user.role === UserRole.Admin ? UserRole.User : UserRole.Admin;
        this.busyUserId.set(user._id);

        this.userService.update(user._id, { role: nextRole }).subscribe({
            next: (res) => {
                this.users.update((list) => list.map((u) => (u._id === user._id ? res.user : u)));
                this.busyUserId.set(null);
            },
            error: (err) => {
                this.busyUserId.set(null);
                this.errorMessage.set(err.error?.message || 'Could not update user.');
            },
        });
    }

    remove(user: User): void {
        if (!confirm(`Delete ${user.name} (${user.email})? This cannot be undone.`)) return;

        this.busyUserId.set(user._id);
        this.userService.remove(user._id).subscribe({
            next: () => {
                this.users.update((list) => list.filter((u) => u._id !== user._id));
                this.busyUserId.set(null);
            },
            error: (err) => {
                this.busyUserId.set(null);
                this.errorMessage.set(err.error?.message || 'Could not delete user.');
            },
        });
    }
}
