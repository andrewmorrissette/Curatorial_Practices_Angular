import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer} from '@angular/platform-browser';
import { LocalWordpressService } from '../../services/localWordpress/wordpress.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';

import { Comment } from '../../models/localWordpressModels/comment.model';
import { SubscriptionLike } from 'rxjs';
//import {AuthenticateService} from '../../services/wordpress/authenticate.service';
import { LocalAuthenticateService } from '../../services/localWordpress/authenticate.service';
import { Artwork } from 'src/app/models/localWordpressModels/artwork.model';

import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-wordpress-hosted-chat',
  templateUrl: './wordpress-hosted-chat.component.html',
  styleUrls: ['./wordpress-hosted-chat.component.less']
})
export class WordpressHostedChatComponent implements OnInit, OnDestroy {
 
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );
  
  constructor(
    private wordpressAPI:LocalWordpressService,
    private _route: Router,
    private _router: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private auth:LocalAuthenticateService,
    private cookieService:CookieService
  ) { }

  private currentComments: Comment[]=[];
  public answeredComments: Comment[]=[];
  public displayQuestions: boolean=false;
  private message:string;
  private messageInput:string;
  private ArtworkID:string;
  private token:string = "";
  private commentSubscription:SubscriptionLike;
  private postSubscription:SubscriptionLike;
  public currentArtwork: Artwork;
  public isLoggedIn:boolean = false;
  public isUnderQA = false;
  private isSpecificPost = false;

  ngOnInit() {
    console.log("Hosted Chat Component");
    this.token = this.cookieService.get("Auth");
    //this.token = this.auth.getToken();
    console.log("Token from Cookie: ",this.token);
    if(this.token){
      console.log("Setting Token in WordpressAPI");
      this.wordpressAPI.setAuthToken(this.token);
      console.log("Token in API: ",this.wordpressAPI.getAuthToken());
      this.isLoggedIn=true;
    }
    let artworkID:string = this._router.snapshot.paramMap.get("id")
    console.log("Post ID: ",artworkID);
    if(artworkID != null && artworkID!==""){
      this.ArtworkID = artworkID;
      this.postSubscription = this.wordpressAPI.getArtworkTitle(Number(artworkID)).subscribe((art)=>{
        console.log("Artwork Pulled up:",art);
        this.currentArtwork = art;
        this.commentSubscription = this.wordpressAPI.getCommentsOfPostID(Number(artworkID)).subscribe((allComments=>{
          var postComments = allComments;
          this.currentComments = postComments;
          console.log(postComments);
          for(let comment of this.currentComments){
            console.log(comment.content.rendered);
          }
        }));
      });
    }
    else{
      console.log("Display All chat rooms?");
    }
  }

  ngOnDestroy(){
    this.commentSubscription.unsubscribe();
    this.postSubscription.unsubscribe();
  }


  displayAnswers(){
    console.log("Displaying Answers")
    this.isUnderQA = true;
    var unarrangedComments:Comment[]=[];
    var currentComments = this.currentComments;
    var childrenComments:Comment[]=[];
    for(var comment of currentComments){
      if(comment.parent !== 0){
        childrenComments.push(comment);
      }
    }
    for(var child of childrenComments){
      for(var parent of currentComments){
        if(parent.id === child.parent){
          unarrangedComments.push(child);
          unarrangedComments.push(parent);
          
          break;
        }
      }
    }
    this.answeredComments = unarrangedComments;
    this.displayQuestions = true;
  }

  displayAll(){
    this.displayQuestions = false;
    this.isUnderQA = false;
  }

  send(){
    this.message = this.messageInput;
    this.messageInput = "";

    console.log("Sending");
    var newComment:Comment;

    const data = JSON.stringify({

      "content":this.message,
      "date": new Date(),
      "date_gmt": new Date().toUTCString,
      "parent":"0",
      "post":this.ArtworkID
    })

    this.wordpressAPI.postCommentOnPostID(this.ArtworkID,data,this.message).subscribe((response)=>{
      console.log("Response",response);
      this.message="";
    })
  }

  handleSubmit(event){
    if(event.keyCode === 13){
      this.send();
    }

  }

  login(){
    this.auth.setArtworkID(this.ArtworkID);
    this._route.navigate(['/login']);
  }

  logout(){
    this.wordpressAPI.setAuthToken("");
    this.auth.setToken("");
    this.isLoggedIn = false;
  }

  backToLabel(){
    this._route.navigate(['/newLabel/',this.wordpressAPI.getCurrentLabel()]);
  }
}

