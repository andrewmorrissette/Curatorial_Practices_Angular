import { Component, OnInit, QueryList } from '@angular/core';
import { newLabel } from 'src/app/models/localWordpressModels/newLabel.model';
import { Artwork } from 'src/app/models/localWordpressModels/artwork.model';
import { extendedLabel} from 'src/app/models/localWordpressModels/extendedLabel.model';
import {LocalWordpressService} from '../../services/localWordpress/wordpress.service';
import { ActivatedRoute } from '@angular/router';
import { Router,NavigationEnd } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeHtml , SafeUrl} from '@angular/platform-browser';
import { TemplateBindingParseResult } from '@angular/compiler';
import { Url } from 'url';
import { SubscriptionLike, Observable,timer} from 'rxjs';

@Component({
  selector: 'app-wordpress-new-label',
  templateUrl: './wordpress-new-label.component.html',
  styleUrls: ['./wordpress-new-label.component.less']
})
export class WordpressNewLabelComponent implements OnInit {

  constructor(private wordpressAPI: LocalWordpressService, private _router: ActivatedRoute,private sanitizer:DomSanitizer,private _route:Router) { }
  public currentLabel:newLabel=null;
  public currentArtwork:Artwork=null;
  public currentExtended:extendedLabel=null;
  public hideTombstone:boolean = false;
  public showExtended:boolean = false;
  public chatOpen:boolean = false;

  public extendedLabel1:extendedLabel=null;
  public extendedLabel2:extendedLabel=null;
  public extendedLabel3:extendedLabel=null;
  public extendedLabel4:extendedLabel=null;

  public labelVideoHTML: SafeHtml;
  public extendedLabelVideoHTML: SafeHtml;

  public labelTimer:number=null;
  public timerSubscription:any = null;

  ngOnInit() {
    console.log("Updated as of 3/12/2020 12:33pm");

    let labelID:string = this._router.snapshot.paramMap.get("id");
    console.log("Label ID: ",Number(labelID));
    if(labelID != null && labelID!=""){
      this.wordpressAPI.getNewLabel(Number(labelID)).subscribe((label)=>{
        console.log("Label: ", label);
        if(label != null){
          this.currentLabel = label;
          console.log("Current Label: ",this.currentLabel);
  
          this.wordpressAPI.getArtworkByArtworkID(this.currentLabel.acf.artwork[0]).subscribe((artwork)=>{
            console.log("Artwork: ",artwork);
            if(artwork != null){
            this.currentArtwork = artwork;
            console.log("Chat Status: ",this.currentArtwork.comment_status);
            if(this.currentArtwork.comment_status == "open"){
              this.chatOpen = true;
            }
            else{
              this.chatOpen = false;
            }
            }
            if(this.currentLabel.acf.video_url!= null && this.currentLabel.acf.video_url!= ""){
              this.labelVideoHTML = this.sanitizeHTML(this.currentLabel.acf.video_url);
            }

            //Get Timer Setting
            this.wordpressAPI.getLabelTimer().subscribe((response)=>{
              if(response[0].acf.labelTimer!=null){
                this.labelTimer = response[0].acf.labelTimer;
                //Set up Timer to run hide function on extended content.
                this.timer();
              }
            })
       
            if(this.currentLabel.acf.firstExtended != null){
              this.wordpressAPI.getExtendedLabel(this.currentLabel.acf.firstExtended).subscribe((extension1)=>{
                if(extension1!=null){
                  this.extendedLabel1 = extension1;
                  this.wordpressAPI.getExtendedLabel(this.currentLabel.acf.secondExtended).subscribe((extension2)=>{
                    if(extension2!=null){
                      this.extendedLabel2 = extension2;
                      this.wordpressAPI.getExtendedLabel(this.currentLabel.acf.thirdExtended).subscribe((extension3)=>{
                        if(extension3!=null){
                          this.extendedLabel3 = extension3;
                          this.wordpressAPI.getExtendedLabel(this.currentLabel.acf.fourthExtended).subscribe((extension4)=>{
                            if(extension4!=null){
                              this.extendedLabel4 = extension4;
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    };
  }

onExtension(extension:extendedLabel){
  console.log("Clicked");
  console.log(extension);
  this.currentExtended = extension;
  if(this.currentExtended.acf.video_url!=null && this.currentExtended.acf.video_url!=""){
    this.extendedLabelVideoHTML = this.sanitizeHTML(this.currentExtended.acf.video_url);
  }
  else{
    this.extendedLabelVideoHTML = null;
  }
  this.showExtended = true;
}
goToChat(){
  console.log("Artwork ID:",this.currentArtwork.id);
  this.wordpressAPI.setCurrentLabel(this.currentLabel.id.toString());
  this._route.navigate(['/chat/',this.currentArtwork.id]);
}

sanitizeHTML(text:string){
  var temp = this.sanitizer.bypassSecurityTrustHtml(text);
  return temp;
}

isChatOpen(){
  console.log("Is Chat Open?: ",this.chatOpen);
  return this.chatOpen;
}

private timer():void{
  this.timerSubscription = timer(this.labelTimer*1000,this.labelTimer*1000).subscribe(()=>{
    if(this.hideTombstone==true){
      this.hideTombstone=false;
      this.showExtended=false;
    }
  });
}
}