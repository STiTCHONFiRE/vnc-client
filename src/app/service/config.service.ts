import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly SERVER_URL: string = 'http://localhost:8080';
  private readonly AUTH_SERVER_URL: string = 'http://localhost:9000';
  private readonly VNC_WEBSOCKET_URL: string = 'ws://localhost:8080';
  private readonly USERS_WEBSOCKET_URL: string = 'ws://localhost:8080';

  private readonly TEST_SERVER_URL: string = 'http://localhost:8080';
  private readonly TEST_AUTH_SERVER_URL: string = 'http://localhost:9000';
  private readonly TEST_VNC_WEBSOCKET_URL: string = 'ws://localhost:8080';
  private readonly TEST_USERS_WEBSOCKET_URL: string = 'ws://localhost:8080';

  constructor() {}

  public getServerUrl() {
    if (isDevMode()) {
      return this.TEST_SERVER_URL;
    }

    return this.SERVER_URL;
  }

  public getAuthUrl() {
    if (isDevMode()) {
      return this.TEST_AUTH_SERVER_URL;
    }

    return this.AUTH_SERVER_URL;
  }

  public getVncWsUrl() {
    if (isDevMode()) {
      return this.TEST_VNC_WEBSOCKET_URL;
    }

    return this.VNC_WEBSOCKET_URL;
  }

  public getUsersWsUrl() {
    if (isDevMode()) {
      return this.TEST_USERS_WEBSOCKET_URL;
    }

    return this.USERS_WEBSOCKET_URL;
  }
}
