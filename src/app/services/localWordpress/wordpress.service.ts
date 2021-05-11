//toDo:
//Look into each request and see if using ?_filter=parameters will be faster
//Look at getNewLabels() for an example. Will only return the ID's and the title.

import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable, of, forkJoin,interval} from 'rxjs';
import {map,mergeMap, flatMap} from 'rxjs/operators';

import {Comment} from '../../models/localWordpressModels/comment.model';
import {selectedLabels} from 'src/app/models/localWordpressModels/selectedlabels.model';
import {newLabel} from 'src/app/models/localWordpressModels/newLabel.model';
import {Artwork} from 'src/app/models/localWordpressModels/artwork.model';
import {extendedLabel} from 'src/app/models/localWordpressModels/extendedLabel.model';
import {labelTimer} from 'src/app/models/localWordpressModels/labelTimer.model';

@Injectable({
  providedIn: 'root'
})
export class LocalWordpressService {

  //////////////////
  //////CHANGE//////
  //////////////////
  private personalWordpressSite:string = ""
  //"testingsmartlabel.art.blog/"; //"http://localhost/cultureconnect/"
  private authToken:string = "";
  private currentLabel:string = "";



  //////////////////
  //DO NOT CHANGE///
  /////////////////

  private wordpressAPI:string=""; //FINAL URL Determined in constructor

  private MasterLevelTag="";  


  
  constructor(private http:HttpClient) {
   }

   setAuthToken(token:string){
     this.authToken=token;
   }
   getAuthToken():string{
     return this.authToken;
   }
  
   getCurrentLabel(){
     return this.currentLabel;
   }
   setCurrentLabel(label:string){
     this.currentLabel = label;
   }

   //LABELS
   getLabels():Observable<selectedLabels>{
    return interval(1000).pipe(flatMap(()=>{
      return this.http.get<selectedLabels>(this.wordpressAPI+"pages?slug=label-select");
    }));
   }
   getNewLabel(id:number):Observable<newLabel>{
    return this.http.get<newLabel>(this.wordpressAPI+"labels2/"+id.toString());
   }
   
   getNewLabels():Observable<newLabel[]>{
     //Will only return the ID & The title (faster)
     return this.http.get<newLabel[]>(this.wordpressAPI+"labels2?_filter=id,title");
   }
   getExtendedLabel(id:number):Observable<extendedLabel>{
     return this.http.get<extendedLabel>(this.wordpressAPI+"extended/"+id.toString());
   }

   getLabelTimer():Observable<labelTimer>{
     return this.http.get<labelTimer>(this.wordpressAPI+"pages?slug=label-timer");
   }
   
   //ARTWORK
   getArtworkByArtworkID(id:number):Observable<Artwork>{
     return this.http.get<Artwork>(this.wordpressAPI+"artwork/"+id.toString());
   }
   getArtworkTitle(artworkID:Number):Observable<Artwork>{
    return this.http.get<Artwork>(this.wordpressAPI+"artwork/"+artworkID.toString()+"?_fields=id,title")
  }

  //COMMENTS

  getCommentsOfPostID(postID:Number){
    console.log("Inside Service, post id: ",postID);
    console.log(this.wordpressAPI + 'comments?post=' + postID.toString());
    return interval(1000).pipe(flatMap(()=>{
      return this.http.get<Comment[]>(this.wordpressAPI + "comments?post=" + postID.toString());
    }));
    //return this.http.get<Comment[]>(this.wordpressAPI + "comments?post=" + postID.toString());
  }

  postCommentOnPostID(PostID:string,data:any,content:string){
    console.log("Inside Service",data);

    //Code that worked: eDrnE2O0Y2h@tjq1E3T6QRV&1fDzMPLb0w*nSgIelaXKX46g@f23#N$L^jezsFIK
    let headers = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization':'Bearer ' + this.authToken
    });
    console.log("Client Authentication",this.authToken);
    //headers.append('Authorization',"Bearer "+this.clientAuthToken);
    console.log("Headers",headers.has('Authorization'));
    let options = {headers:headers};
    console.log("Options",options.headers.getAll('Authorization'));
    console.log(this.http.post(this.wordpressAPI+"app_posts/"+PostID+"/replies/new",data,options),"API CALL");
    return this.http.post(this.wordpressAPI+"comments?app_post="+PostID+"&content="+content,data,options);
  }
}


