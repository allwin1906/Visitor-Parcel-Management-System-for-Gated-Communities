import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket;

    constructor(private authService: AuthService) {
        const token = this.authService.getToken();
        this.socket = io('http://localhost:4000', {
            auth: {
                token: token
            },
            autoConnect: false
        });
    }

    connect() {
        const token = this.authService.getToken();
        if (token) {
            this.socket.auth = { token };
            this.socket.connect();
        }
    }

    disconnect() {
        this.socket.disconnect();
    }

    onNotification(): Observable<any> {
        return new Observable(observer => {
            this.socket.on('notification', (data) => {
                observer.next(data);
            });
        });
    }
}
