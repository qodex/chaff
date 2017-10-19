import { Component, OnInit } from '@angular/core';
import { ChaffService } from '../../services/chaff.service';

@Component({
  selector: 'input-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit {

  inputValue: string;

  constructor(private chaff: ChaffService) { }

  ngOnInit() {
    document.getElementById("inputField").focus();
  }

  send() {
    this.chaff.send(this.inputValue);
    this.inputValue = "";
    this.scrollDown();
  }

  keyup(event) {
    if(event.key === "Enter") this.send();
  }

  scrollDown() {
    document.querySelector('.buffer').scrollIntoView({behavior: 'smooth'});
    document.getElementById("inputField").focus();
  }

  fileSelected(event) {
    if(event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (readerEvt) => {
          let target: any = readerEvt.target;
          let bytes = target.result;
          let image = new Image();
          image.onload = (e) => { 
            var canvas = document.createElement('canvas');
            this.rotateAndDraw(image, bytes, canvas);
            var dataURL = canvas.toDataURL("image/jpeg", 0.3);
            this.inputValue = dataURL;
            this.send();
            //canvas.remove();
            document.body.appendChild(canvas);
            setTimeout( ()=> {canvas.remove()}, 2000);
          }
          image.src = "data:image/jpg;base64,"+btoa(bytes);
        };
        reader.readAsBinaryString(event.target.files[0]);
    }
  }

  rotateAndDraw(image, bytes, canvas) {
    let ctx = canvas.getContext('2d');
    let width = image.width/4;
    let height = image.height/4;

    if(this.getOrientation(bytes)===6) {
      canvas.width = height;
      canvas.height = width;
      ctx.translate(canvas.width/2,canvas.height/2);
      ctx.rotate(Math.PI/2);
      ctx.drawImage(image, -width/2, -height/2, width, height);
      ctx.rotate(-Math.PI/2);
      ctx.translate(-width/2,-height/2);
    } else if(this.getOrientation(bytes)===8) {
      canvas.width = height;
      canvas.height = width;
      ctx.translate(canvas.width/2,canvas.height/2);
      ctx.rotate(-Math.PI/2);
      ctx.drawImage(image, -width/2, -height/2, width, height);
      ctx.rotate(Math.PI/2);
      ctx.translate(-width/2,-height/2);
    } else if(this.getOrientation(bytes)===3) {
      canvas.width = width;
      canvas.height = height;
      ctx.translate(canvas.width/2,canvas.height/2);
      ctx.rotate(-Math.PI);
      ctx.drawImage(image, -width/2, -height/2, width, height);
      ctx.rotate(Math.PI);
      ctx.translate(-width/2,-height/2);
    } else {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0, width, height);
    }
  }

  getOrientation(binary_string) {
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    var view = new DataView(bytes.buffer);
    if (view.getUint16(0, false) != 0xFFD8) return -2;
    var length = view.byteLength, offset = 2;
    while (offset < length) {
      var marker = view.getUint16(offset, false);
      offset += 2;
      if (marker == 0xFFE1) {
        if (view.getUint32(offset += 2, false) != 0x45786966) return -1;
        var little = view.getUint16(offset += 6, false) == 0x4949;
        offset += view.getUint32(offset + 4, little);
        var tags = view.getUint16(offset, little);
        offset += 2;
        for (var i = 0; i < tags; i++)
          if (view.getUint16(offset + (i * 12), little) == 0x0112)
            return view.getUint16(offset + (i * 12) + 8, little);
      }
      else if ((marker & 0xFF00) != 0xFF00) break;
      else offset += view.getUint16(offset, false);
    }
    return -1;
  }

}
