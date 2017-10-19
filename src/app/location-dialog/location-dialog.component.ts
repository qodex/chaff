import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ChaffService } from "../services/chaff.service";

@Component({
  selector: 'location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.scss']
})
export class LocationDialogComponent implements OnInit {

  isGeolocationAllowed = false;
  dialogText = "Allow Chaff to see your location and enjoy chatting to anyone within 2 km absolutely anonymously!";

  constructor(private router: Router, private chaff: ChaffService) { }

  ngOnInit() {
  }

  requestLocation() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.chaff.position = position;
        this.isGeolocationAllowed = true;
        this.chaff.logSessionPosition();
        this.router.navigate(["name"]);
      },
      error => {
        this.dialogText = "Hmm... still can't access your location, you may have it disabled in global settings...";
        this.isGeolocationAllowed = false;
      },
      {enableHighAccuracy: true, timeout: 5000, maximumAge: 0}
    );
  }

}
