import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AutheticationInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('auth iterceptor');
    const token = localStorage.getItem('jwt-token');
    if (token) {
      // console.log('authenticated');
      const cloned = req.clone({
          headers: req.headers.set('Authorization',
              'Bearer ' + token)
      });

      return next.handle(cloned);
  } else {
      // console.log('not authenticated');
      return next.handle(req);
  }
  }
}