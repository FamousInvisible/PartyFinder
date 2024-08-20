import { Component, inject } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { NgFor } from '@angular/common';
import { SubscriberCardComponent } from "./subscriber-card/subscriber-card.component";
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../data/services/profile.service';
import { AsyncPipe } from '@angular/common';
import { firstValueFrom, map } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { ImgUrlPipe } from "../../helpers/pipes/img-url.pipe";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SvgIconComponent, NgFor, SubscriberCardComponent, RouterLink, AsyncPipe, JsonPipe, ImgUrlPipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  profileService = inject(ProfileService)

  subscribers$ = this.profileService.getSubscribersShortList()
  
  me = this.profileService.me

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: ''
    },
    {
      label: 'Чаты',
      icon: 'chat',
      link: 'chats'
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search'
    }
  ]

  ngOnInit(){
    firstValueFrom(this.profileService.getMe())
  }
}
