import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/service/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    readonly mode = signal<'login' | 'register'>('login');
    readonly errorMessage = signal<string | null>(null);
    readonly isSubmitting = signal(false);
    private readonly fb = inject(FormBuilder);
    readonly loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });
    readonly registerForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    setMode(mode: 'login' | 'register'): void {
        this.mode.set(mode);
        this.errorMessage.set(null);
    }

    submitLogin(): void {
        if (this.loginForm.invalid) return;
        const { email, password } = this.loginForm.getRawValue();
        this.errorMessage.set(null);
        this.isSubmitting.set(true);

        this.auth.login(email!, password!).subscribe({
            next: (res) => this.redirectByRole(res.user.role),
            error: (err) => {
                this.isSubmitting.set(false);
                this.errorMessage.set(err.error?.message || 'Could not log in.');
            },
        });
    }

    submitRegister(): void {
        if (this.registerForm.invalid) return;
        const { name, email, password } = this.registerForm.getRawValue();
        this.errorMessage.set(null);
        this.isSubmitting.set(true);

        this.auth.register(name!, email!, password!).subscribe({
            next: (res) => this.redirectByRole(res.user.role),
            error: (err) => {
                this.isSubmitting.set(false);
                this.errorMessage.set(err.error?.message || 'Could not register.');
            },
        });
    }

    private redirectByRole(role: 'admin' | 'user'): void {
        this.isSubmitting.set(false);
        this.router.navigate([role === 'admin' ? '/admin/results' : '/vote']);
    }
}
