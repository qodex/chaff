import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { LocationDialogComponent } from './location-dialog/location-dialog.component';
import { NameDialogComponent } from './name-dialog/name-dialog.component';
import { ChatComponent } from './chat/chat.component';


const routes: Routes = [
  {
    path: '',
    component: LocationDialogComponent,
    children: []
  },
  {
    path: 'name',
    component: NameDialogComponent,
    children: []
  },
  {
    path: 'chat',
    component: ChatComponent,
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
