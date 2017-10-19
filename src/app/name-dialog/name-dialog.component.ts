import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChaffService } from "../services/chaff.service";

@Component({
  selector: 'name-dialog',
  templateUrl: './name-dialog.component.html',
  styleUrls: ['./name-dialog.component.scss']
})
export class NameDialogComponent implements OnInit {

  userName: string;
  dialogText = "Your name";

  constructor(private router: Router, private chaff: ChaffService) { }

  ngOnInit() {
    document.getElementById("userName").focus();
  }

  keyup(event) {
    if(event.key === "Enter") this.setName();
  }

  setName() {
    this.chaff.userName = this.userName;
    this.router.navigate(["chat"]);
  }

}
