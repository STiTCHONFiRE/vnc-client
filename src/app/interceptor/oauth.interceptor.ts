import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { OAuthModuleConfig, OAuthStorage } from 'angular-oauth2-oidc';

export function checkUrl(
  url: string,
  moduleConfig: OAuthModuleConfig
): boolean {
  const found = moduleConfig.resourceServer.allowedUrls.find(u =>
    url.startsWith(u)
  );
  return !!found;
}

export const oauthInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authStorage = inject(OAuthStorage);
  const moduleConfig = inject(OAuthModuleConfig);

  const url = req.url.toLowerCase();

  if (!moduleConfig) return next(req);
  if (!moduleConfig.resourceServer) return next(req);
  if (!moduleConfig.resourceServer.allowedUrls) return next(req);
  if (!checkUrl(url, moduleConfig)) return next(req);

  const sendAccessToken = moduleConfig.resourceServer.sendAccessToken;

  if (sendAccessToken) {
    const token = authStorage.getItem('access_token');
    const header = 'Bearer ' + token;

    const headers = req.headers.set('Authorization', header);

    req = req.clone({ headers });
  }

  return next(req);
};
