import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChaffService } from '../services/chaff.service';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(private router: Router, private chaff: ChaffService) { }

  ngOnInit() {
    if(this.chaff.userName) this.chaff.send("🔔"); 
    else this.router.navigate(["/"]);
  }

}
