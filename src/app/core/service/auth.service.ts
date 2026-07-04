import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environment/environment';
import { AuthResponse } from '../model/auth.model';
import { User } from '../model/user.model';

const TOKEN_KEY = 'octovote_token';
const USER_KEY = 'octovote_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
    readonly currentUser = signal<User | null>(this.readStoredUser());

    constructor(private http: HttpClient) {}

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
            .pipe(tap((res) => this.setSession(res)));
    }

    register(name: string, email: string, password: string): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${environment.apiUrl}/auth/register`, { name, email, password })
            .pipe(tap((res) => this.setSession(res)));
    }

    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        this.currentUser.set(null);
    }

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    isAdmin(): boolean {
        return this.currentUser()?.role === 'admin';
    }

    private setSession(res: AuthResponse): void {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        this.currentUser.set(res.user);
    }

    private readStoredUser(): User | null {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? (JSON.parse(raw) as User) : null;
    }
}
