import {Injectable} from '@angular/core';
import {OAuthService} from "angular-oauth2-oidc";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private err: boolean;

  constructor(private oauthService: OAuthService) {
    const config = {
      issuer: "http://localhost:9000",
      redirectUri: `http://localhost:4200/index.html`,
      silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
      useSilentRefresh: true,
      clientId: 'client',
      responseType: 'code',
      scope: 'openid profile',
    };

    this.oauthService.configure(config);
  }

  async loadAuthConfig() {
    try {
      await this.oauthService.loadDiscoveryDocument();
      const login = await this.oauthService.tryLogin();

      if (login) {
        console.log("DONE!")
        this.oauthService.setupAutomaticSilentRefresh();
        console.log(this.oauthService.getAccessToken())
      }
    } catch {
      this.err = true;
    }
  }

  login() {
    this.oauthService.initCodeFlow()
  }

  logout() {
    this.oauthService.logOut();
  }

  public get name(): any {
    return this.oauthService.getIdentityClaims();
  }

  public get authorities(): string[] {
    return this.oauthService.getIdentityClaims()['authorities'];
  }

  public isAuth(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  public isErr(): boolean {
    return this.err;
  }
}
