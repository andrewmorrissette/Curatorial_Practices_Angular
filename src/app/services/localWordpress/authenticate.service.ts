import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders, HttpParams} from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl, SafeHtml , SafeUrl} from '@angular/platform-browser';
import {Observable, of, forkJoin,interval} from 'rxjs';
import {map,mergeMap, flatMap} from 'rxjs/operators';

import { stringify } from '@angular/compiler/src/util';
import { keyframes } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})

//Authentication + Authenticated Requests
export class LocalAuthenticateService {

  private token:string="";
  private artworkID:string ="";

  

  constructor(private http:HttpClient) { }

  getAuthenticationToken(username:string, password:string):Observable<any>{

    const body = new HttpParams()
      .set('username',username)
      .set('password',password)
    return this.http.post("",body);

   }

   getToken():string{
     return this.token;
   }

   setToken(tok:string){
     this.token = tok;
   }

   getArtworkID():string{
     return this.artworkID;
   }
   setArtworkID(id:string){
     this.artworkID = id;
   }

   registerUser(username:string,email:string,password:string):Observable<any>{
     const body = new HttpParams()
      .set('username',username)
      .set('email',email)
      .set('password',password);

    const userLogin = {
      "username":username,
      "password":password,
      "email":email
    }

    const headerDict = {
      'Content-Type': 'application/json',
      "username":username,
      "password":password,
      "email":email
    }
      
    // const requestOptions = {                                                                                                                                                                                 
    //   headers: new HttpHeaders(headerDict), 
    // };

  
      
      return this.http.post("",headerDict);
   }
}



