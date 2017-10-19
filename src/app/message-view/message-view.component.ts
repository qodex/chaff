import { Component, OnInit } from '@angular/core';
import { ChaffService } from "../services/chaff.service";
import { Message } from "../model/message"

@Component({
  selector: 'message-view',
  templateUrl: './message-view.component.html',
  styleUrls: ['./message-view.component.scss']
})
export class MessageViewComponent implements OnInit {

  messages: Message[] = [];
  position: any;
  flashPic: string;
  flashPicOrientation: number;

  constructor(private chaff: ChaffService) { }

  ngOnInit() {

    this.chaff.onMyMessage.subscribe(message => {
      if(message.length<1024) this.messages.push({source: "me", text: message});
      document.querySelector('.buffer').scrollIntoView({behavior: 'smooth'});
      document.getElementById("inputField").focus();
    });
    this.chaff.onTheirMessage.subscribe(message => {
      console.log(message.data);
      let isMyMessage = message.data.indexOf(this.chaff.sessionId)>0;
      if(!isMyMessage) {
        let distanceKm = this.chaff.getDistance(message.data.split("/")[4], message.data.split("/")[3]);
        if(distanceKm<=20000) {
          let distanceStr = this.distanceToStr(distanceKm);
          this.chaff.get(message.data).subscribe(result => {
            this.notify();
            if(result.length<512) {
              this.messages.push({source: "them", text: "("+distanceStr+") " + result});
            } else {
              this.flashPic=result;
              this.flashPicOrientation = 1;//this.getOrientation(result);
              document.getElementById("inputField").blur();
              setTimeout(()=>{this.flashPic=""}, 7000);
            }
          });
          this.scrollDown();
        }
      }
    });
  }

  scrollDown() {
    document.querySelector('.buffer').scrollIntoView({behavior: 'smooth'});
    document.getElementById("inputField").focus();
  }

  notify() {
    try {
      window.navigator.vibrate([100,50,100]);
    } catch(e) {
      console.error(e);
    }
    try {
      let audio = new Audio();
      audio.src = "assets/coin_flip.wav";
      audio.load();
      audio.play();
    } catch(e) {
      console.error(e);
    }
  }

  distanceToStr(d) {
    return d>1? (""+d).split(".")[0]+" km" : ("" + d * 1000).split(".")[0]+" m";
  }

}
