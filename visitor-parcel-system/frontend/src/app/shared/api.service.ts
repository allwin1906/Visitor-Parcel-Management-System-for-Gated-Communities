import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    // private baseUrl = environment.apiUrl; // e.g., http://localhost:4000
    private baseUrl = 'http://localhost:4000';

    constructor(private http: HttpClient) { }

    // API Methods
    createVisitor(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/visitor`, data);
    }

    createParcel(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/parcel`, data);
    }

    getItems(residentId?: number): Observable<any[]> {
        let url = `${this.baseUrl}/items`;
        if (residentId) {
            url += `?residentId=${residentId}`;
        }
        return this.http.get<any[]>(url);
    }

    updateItemStatus(id: number, status: string): Observable<any> {
        return this.http.patch(`${this.baseUrl}/item/${id}/status`, { status });
    }

    getUsers(role?: string): Observable<any[]> {
        let url = `${this.baseUrl}/users`;
        if (role) url += `?role=${role}`;
        return this.http.get<any[]>(url);
    }

    getAdminStats(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/admin/stats`);
    }

    registerUser(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/auth/register`, data);
    }
}
