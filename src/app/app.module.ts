import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {AppRoutingModule} from './app-routing.module';

import { AppComponent } from './app.component';
import { TextComponent } from './input/text/text.component';
import { MessageViewComponent } from './message-view/message-view.component';

import { ChaffService } from './services/chaff.service';
import { LocationDialogComponent } from './location-dialog/location-dialog.component';
import { NameDialogComponent } from './name-dialog/name-dialog.component';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    TextComponent,
    MessageViewComponent,
    LocationDialogComponent,
    NameDialogComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [ ChaffService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
