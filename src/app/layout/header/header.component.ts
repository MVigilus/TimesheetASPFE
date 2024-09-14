import { DOCUMENT, NgClass } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConfigService } from '@config';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { InConfiguration, AuthService, LanguageService } from '@core';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatMenuModule } from '@angular/material/menu';
import { FeatherIconsComponent } from '../../shared/components/feather-icons/feather-icons.component';
import { MatButtonModule } from '@angular/material/button';
import {interval, Subscription} from "rxjs";
import {NotificationService} from "@core/service/notification.service";
import {NotificationPlaceHolder, Notifications} from "@core/models/Notifications";
import {HttpErrorResponse} from "@angular/common/http";
import {MatBadge} from "@angular/material/badge";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    FeatherIconsComponent,
    MatMenuModule,
    RouterLink,
    NgClass,
    NgScrollbar,
    MatBadge,
  ],
  providers: [LanguageService],
})
export class HeaderComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  public config!: InConfiguration;
  homePage?: string;
  isNavbarCollapsed = true;
  flagvalue: string | string[] | undefined;
  countryName: string | string[] = [];
  langStoreValue?: string;
  defaultFlag?: string;
  isOpenSidebar?: boolean;
  docElement?: HTMLElement;
  isFullScreen = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private configService: ConfigService,
    protected authService: AuthService,
    private router: Router,
    public languageService: LanguageService,
    private notificationService: NotificationService,
  ) {
    super();
  }
  listLang = [
    { text: 'Italiano', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    /*{ text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },*/
  ];

  notifications: NotificationPlaceHolder[] = [

  ];
  unreaded:number=0;

  ngOnInit() {
    this.config = this.configService.configData;
    this.docElement = document.documentElement;

    this.homePage = 'dashboard/dashboard1';

    this.langStoreValue = localStorage.getItem('lang') as string;
    const val = this.listLang.filter((x) => x.lang === this.langStoreValue);
    this.countryName = val.map((element) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.defaultFlag = 'assets/images/flags/italy.jpg';
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }

    this.subs.sink=this.notificationService.getNotifications().subscribe(
      (newNotifications ) => {
        this.notifications = [];
        this.unreaded=0
        newNotifications.forEach((el)=>{
          if(el.status==='msg-unread' && el.message!=undefined){
            this.notifications.push(el);
            this.unreaded++
          }
        })
      },
      (error) => {
        console.error('Error loading notifications:', error);
      }
    );;

    this.notificationService.fetchInitialNotifications();

  }

  callFullscreen() {
    if (!this.isFullScreen) {
      if (this.docElement?.requestFullscreen != null) {
        this.docElement?.requestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
    this.isFullScreen = !this.isFullScreen;
  }
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.langStoreValue = lang;
    this.languageService.setLanguage(lang);
  }
  mobileMenuSidebarOpen(event: Event, className: string) {
    const hasClass = (event.target as HTMLInputElement).classList.contains(
      className
    );
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }

    const hasClass2 = this.document.body.classList.contains('side-closed');
    if (hasClass2) {
      // this.renderer.removeClass(this.document.body, "side-closed");
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    } else {
      // this.renderer.addClass(this.document.body, "side-closed");
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'false');
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'true');
    }
  }
  gotToAccountPage(){
    console.log('/'+this.router.url.split('/')[1]+'/account')
    this.router.navigate(['/'+this.router.url.split('/')[1]+'/account']);
  }
  logout() {
    this.subs.sink = this.authService.logout().subscribe({
      next: (res:any) => {
    }
    });
    this.router.navigate(['/authentication/signin']);

  }

  markAllAsReaded() {
    this.notificationService.markAsRead()
    this.notifications=[]
    this.unreaded=0
    this.notificationService.fetchInitialNotifications()
  }

}
