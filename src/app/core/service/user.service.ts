import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { User, UserRole } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/user`;

    list(): Observable<{ users: User[] }> {
        return this.http.get<{ users: User[] }>(this.baseUrl);
    }

    update(id: string, changes: Partial<Pick<User, 'name' | 'email' | 'role'>>): Observable<{ user: User }> {
        return this.http.patch<{ user: User }>(`${this.baseUrl}/${id}`, changes);
    }

    remove(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
    }
}
