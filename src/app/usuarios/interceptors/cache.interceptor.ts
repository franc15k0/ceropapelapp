import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest, HttpHeaderResponse, HttpSentEvent,
  HttpProgressEvent,HttpResponse, HttpUserEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler):
  Observable <HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
  const nextReq = req.clone({
      headers: req.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      .set('Pragma', 'no-cache')
      .set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT')
      .set('If-Modified-Since', '0')
  });

  return next.handle(nextReq);
}
}
