import {AfterViewInit, Component, ElementRef, isDevMode, OnDestroy, OnInit, ViewChild} from '@angular/core';
import NoVncClient from "@novnc/novnc/lib/rfb.js";
import {ActivatedRoute} from "@angular/router";
import {InfoPanelComponent} from "../info-panel/info-panel.component";
import {BehaviorSubject, catchError, EMPTY, first, Observable, Subscription, tap} from "rxjs";
import {TokenData} from "../interface/token-data";
import {ConfigService} from "../service/config.service";
import {UserDataEvent, UsersData} from "../interface/user-data-event";
import {WebSocketService} from "../service/web-socket.service";
import {VnsService} from "../service/vns.service";


@Component({
  selector: 'app-vnc-client',
  templateUrl: './vnc-client.component.html',
  styleUrl: './vnc-client.component.scss'
})
export class VncClientComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('vnc')
  vnc: ElementRef<HTMLElement>;

  @ViewChild('modalClipboard')
  modalClipboard: ElementRef<HTMLDialogElement>;

  @ViewChild(InfoPanelComponent)
  infoPanel: InfoPanelComponent;

  err$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  users$: Observable<UserDataEvent>;
  subscription$: Subscription;
  usersArray$: Observable<UsersData>;

  private client: NoVncClient;
  private id: string;
  private tokenData: TokenData;

  users: Set<string> = new Set<string>();

  clipboard: string = "";

  constructor(
    private route: ActivatedRoute,
    private configService: ConfigService,
    private webSocketService: WebSocketService,
    private vncService: VnsService
  ) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    this.route.data.subscribe(
      ({tokenData}) => {
        this.tokenData = tokenData;
      }
    );
  }

  disconnect() {
    this.client.disconnect();
    this.subscription$.unsubscribe();
  }

  sendClipboard() {
    //console.log(this.clipboard)
    this.client.clipboardPasteFrom(this.clipboard)
  }

  ngAfterViewInit(): void {
    this.client = new NoVncClient(
      this.vnc.nativeElement as Element,
      `${this.configService.getVncWsUrl()}/ws/${this.id}?${this.tokenData.queryParameterName}=${this.tokenData.token}`,
      {
        shared: true
      }
    );
    this.client.clipViewport = true;
    this.client.scaleViewport = true;
    this.client.addEventListener("disconnect", this.disconnectEventFn);
    this.client.addEventListener("connect", this.connectedEventFn);
  }

  disconnectEventFn = (event: CustomEvent<{ clean: boolean }>) => {
    if (event.detail.clean) {
      if (isDevMode())
        console.log("Disconnected from the server");
    } else {
      this.loading$.next(false);
      this.err$.next(true);
      this.modalClipboard.nativeElement.close();
      this.infoPanel.sendMessage("Ошибка подключения: что-то пошло не так, попробуйте позже", "ERR")
    }
  }

  connectedEventFn = () => {
    this.loading$.next(false);
    this.infoPanel.sendMessage("Успешно подключено к удаленному компьютеру", "SUCCESS");
    this.users$ = this.webSocketService.connect$(`${this.configService.getVncWsUrl()}/ws/users/${this.id}?${this.tokenData.queryParameterName}=${this.tokenData.token}`)
      .pipe(
        catchError(e => {
          console.error(e);
          return EMPTY;
        })
      );

    this.usersArray$ = this.vncService.users$(this.id);
    this.usersArray$.subscribe((x) => {
      this.users = new Set<string>(x.usernames);
      this.subscription$ = this.users$.subscribe((event) => {
        console.log(event);
        if (event.eventType === "CONNECT") {
          this.users.add(event.username);
        } else {
          this.users.delete(event.username);
        }
      });
    })
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
