import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class ChaffService {

  @Output() onMyMessage = new EventEmitter<string>();
  @Output() onTheirMessage = new EventEmitter<string>();

  wsUrl = "wss://"+window.location.host+"/bigtree/chaff";

  ws : WebSocket;

  sessionId: string;
  position: Position;
  userName: string;

  constructor(private http: Http) {
    this.sessionId = "_" + new Date().getTime();
    this.initiateWebSocket();
  }

  initiateWebSocket() {
    try {
      this.ws = new WebSocket(this.wsUrl);
    } catch(e) {
      console.log(e);
    }
    this.ws.onopen = () => this.logSessionInit();
    this.ws.onmessage = this.onTheirMessage.next.bind(this.onTheirMessage);
    this.ws.onclose = () => this.initiateWebSocket();
    this.ws.onerror = (error) => console.log(error);
  }

  logSessionInit() {
    let sessionInfo = new Date()+"\n"+navigator.language+"\n"+navigator.userAgent+"\n"+navigator.platform;
    this.http.post("/bigtree/chaff/sessions/"+this.sessionId+"/init", sessionInfo).subscribe(response => {}, error => {});
  }

  logSessionPosition() {
    let positionInfo = this.position.coords.latitude+", "+this.position.coords.longitude;
    this.http.post("/bigtree/chaff/sessions/"+this.sessionId+"/position", positionInfo).subscribe(response => {}, error => {});
  }

  send(text: string) {
    if(!text) return;
    this.onMyMessage.emit(text);
    let isImage = text.length>1024;
    if(!isImage) text = this.userName+": "+text;
    this.http.post("/bigtree/chaff/"+this.position.coords.longitude+"/"+this.position.coords.latitude+"/"+this.sessionId+"/"+new Date().getTime(), text).subscribe(response=>{}, error=>{});
  }

  get(path): Observable<string> {
    return Observable.create(observer => {
      this.http.get(path).subscribe(
        response => {
          observer.next(response.text());
        }, 
        error => { 
          observer.error(error);
        }
      );
    });
  }

  getDistance(lat, lon) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(this.position.coords.latitude-lat);  // deg2rad below
    var dLon = this.deg2rad(this.position.coords.longitude-lon); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(this.position.coords.latitude)) * Math.cos(this.deg2rad(lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

}
