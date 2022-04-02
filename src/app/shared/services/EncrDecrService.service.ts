import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})

export class EncrDecrService {
  constructor() { }
  //The set method is use for encrypt the value.
  set(keys, value){
    return CryptoJS.AES.encrypt(value, keys).toString();
  }

  //The get method is use for decrypt the value.
  get(keys, value){
    return CryptoJS.AES.decrypt(value, keys).toString(CryptoJS.enc.Utf8);
  }
}