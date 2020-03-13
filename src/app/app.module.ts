import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MyMaterialModule } from  './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { SafeURLPipe } from './pipes/safe-url.pipe';
import { CookieService} from 'ngx-cookie-service';

//Wordpress
import { WordpressCommentComponent } from './components/wordpress-comment/wordpress-comment.component';
import {LoginComponent} from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { WordpressNewLabelComponent } from './components/wordpress-new-label/wordpress-new-label.component';
import { LabelSelectComponent } from './components/label-select/label-select.component';
import {WordpressHostedChatComponent} from './components/wordpress-hosted-chat/wordpress-hosted-chat.component';

const appRoutes: Routes = [
    {path: 'chat/:id',component:WordpressHostedChatComponent},
    {path: 'login',component:LoginComponent},
    {path: 'register',component:RegisterComponent},
    {path: 'newLabel/:id',component:WordpressNewLabelComponent},
    {path: '',component:LabelSelectComponent},
    
];

@NgModule({
  declarations: [
    AppComponent,
    SafeURLPipe,
    WordpressCommentComponent,
    LoginComponent,
    RegisterComponent,
    WordpressNewLabelComponent,
    LabelSelectComponent,
    WordpressHostedChatComponent,
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MyMaterialModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true, useHash:true} //<--debugging
    ),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],

 
})
export class AppModule { }
