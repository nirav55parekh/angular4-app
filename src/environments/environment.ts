// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  LOGIN_URL: 'https://127.0.0.1:3000/',
  LOGOUT_URL: 'https://127.0.0.1:3000/',
  SERVER_URL: 'https://127.0.0.1:3000/api/v1/',
  POD_SERVER_URL: 'http://127.0.0.1',
  ANGULAR_SERVER_URL: 'https://127.0.0.1',
  POD_SERVER_PORT: '5000',
  ANGULAR_PORT: '3000',
  POD_SERVER_ROOM: '/pod',
  heartBeat: 30000,
  deviceControl: 30000,
  scanstartText: 'Start Procedure:::',
  STORE_LOGIN: '/auth/authlogin',
  STORE_URL: 'https://store.obdii.io',
  STORE_LOGOUT: '/index.php/customer/account/logout',
};