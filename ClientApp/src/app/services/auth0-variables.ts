export const AUTH_CONFIG: AuthConfig = {
    clientID: '76DJbnZYOVib159sRvgbc9W55ZrfEiAz',
    domain: 'abvegaproject.au.auth0.com',
    callbackURL: 'http://localhost:5001/callback',
    responseType: 'token id_token',
    audience: 'https://abvegaproject.au.auth0.com/userinfo',
    redirectUri: 'https://localhost:5001/',
    scope: 'openid profile email'
};