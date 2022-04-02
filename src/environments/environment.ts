// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  secretkey:'seretkey',
  firebase: {
    projectId: "test-918f3",
    appId: "1:714841028511:web:d2b1d96fbbabe69424afaa",
    storageBucket: "test-918f3.appspot.com",
    apiKey: "AIzaSyAqdf3JjxH1UY2Q0D5Z-AsxcZTSyDxHpPY",
    authDomain: "test-918f3.firebaseapp.com",
    messagingSenderId: "714841028511",
  },
  production: false,
  apiUrl: 'https://test-918f3-default-rtdb.europe-west1.firebasedatabase.app',
  firebaseConfig : {
    apiKey: "AIzaSyAqdf3JjxH1UY2Q0D5Z-AsxcZTSyDxHpPY",
    authDomain: "test-918f3.firebaseapp.com",
    projectId: "test-918f3",
    storageBucket: "test-918f3.appspot.com",
    messagingSenderId: "714841028511",
    appId: "1:714841028511:web:d2b1d96fbbabe69424afaa"
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
