// import { Injectable } from '@angular/core';
// import * as signalR from '@microsoft/signalr';
// import { environment } from '../../../environments/environment.development';

// @Injectable({ providedIn: 'root' })
// export class NotificationService {
//   private hubConnection!: signalR.HubConnection;
//   private baseUrl = `${environment.baseUrl}`;

//   public startConnection(token: string): void {
//     this.hubConnection = new signalR.HubConnectionBuilder()
//       .withUrl(`${this.baseUrl}/notificationHub`, {
//         accessTokenFactory: () => token,
//         withCredentials: true
//       })
//       .withAutomaticReconnect()
//       .build();

//     this.hubConnection
//       .start()
//       .then(() => console.log('✅ SignalR connected.'))
//       .catch(err => console.error('❌ Error:', err));

//     this.hubConnection.on('ReceiveNotification', (message: string) => {
//       console.log("📩 Notification Received:", message);
//       alert(message);
//     });
//   }

//   public stopConnection(): void {
//     if (this.hubConnection) this.hubConnection.stop();
//   }
// }
