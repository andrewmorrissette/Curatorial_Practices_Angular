import { Component, OnInit } from '@angular/core';
import { LocalWordpressService} from '../../services/localWordpress/wordpress.service';
import { LocalAuthenticateService} from '../../services/localWordpress/authenticate.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private wordpressAPI:LocalWordpressService,
    private auth:LocalAuthenticateService,
    private _route: Router,
    private cookieService:CookieService) { }

  public hasToken:boolean = false;
  private cookieValue:string;
  public dayInSeconds = 86400000;
  public errorMessage = "";

  loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
  });
  
  }

  get f() { return this.loginForm.controls; }

  login(){
    console.log(this.f.username.value);
    console.log(this.f.password.value);
    }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    console.log(this.f.username.value);
    console.log(this.f.password.value);

    //Use auth API to verify user is in Wordpress DB
    //If login successful take back to home page
    //TODO: Take back to previous chat, but have them stay logged in
    this.auth.getAuthenticationToken(this.f.username.value,this.f.password.value).subscribe((response)=>{
      console.log("Response",response);
      this.errorMessage="";
      if(response.token != null && response.token != "" && response.token != undefined){
        //Cookie Generation
        var expiredDate = new Date();
        expiredDate.setDate(expiredDate.getDate() + 7);
        console.log("Date added:", expiredDate);
        this.cookieService.set('Auth',response.token,expiredDate);
        this.cookieValue = this.cookieService.get('Auth');
        console.log("Cookie Value",this.cookieValue);

        //this.auth.setToken(response.token);
        //console.log(this.auth.getToken(),"Token Saved");

        this._route.navigate(['/chat/' + this.auth.getArtworkID()]);

      }
    },
    (error)=>{
      console.log("Error",error);
      var errorCode = error.error.code;
      if(errorCode == "[jwt_auth] invalid_username"){
        this.errorMessage = "Invalid Username";
      }
      if(errorCode == "[jwt_auth] incorrect_password"){
        this.errorMessage = "The password you entered for the username <strong>" + this.f.username.value + "</strong> is incorrect";
      }
      console.log("Error Message: ",this.errorMessage);
    })
  }

  onRegister(){

    if(this.loginForm.invalid){
      return;
    }

    
  }

}
