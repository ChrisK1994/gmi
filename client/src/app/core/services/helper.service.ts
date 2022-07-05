import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  public IS_URL_REGEX = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  public IS_POST_LINK_REGEX = /(\b(>>)[0-9]{8})/gi;

  constructor() { }

  public randomString(len = 10, charStr = 'abcdefghijklmnopqrstuvwxyz0123456789'): string {
    const chars = [...`${charStr}`];
    // tslint:disable-next-line: no-bitwise
    return [...Array(len)].map((i) => chars[(Math.random() * chars.length) | 0]).join('');
  }

}
