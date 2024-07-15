import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {TokenService} from "../service/token.service";
import NoVncClient from "@novnc/novnc/lib/rfb.js";
import {ConfigService} from "../service/config.service";

@Component({
  selector: 'app-card-vnc',
  templateUrl: './card-vnc.component.html',
  styleUrl: './card-vnc.component.scss'
})
export class CardVncComponent implements OnInit, AfterViewInit {
  @Input()
  id: string
  @Input()
  ipAddressAndPort: string
  @Input()
  index: number;

  @ViewChild('vnc')
  vnc: ElementRef<HTMLElement>;

  client: NoVncClient;

  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  init$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  err$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private tokenService: TokenService, private configService: ConfigService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.tokenService.token$(this.id).subscribe((tokenData) => {

      this.client = new NoVncClient(
        this.vnc.nativeElement as Element,
        `${this.configService.getVncWsUrl()}/ws/${this.id}?${tokenData.queryParameterName}=${tokenData.token}`,
        {
          shared: true
        }
      );
      this.client.clipViewport = true;
      this.client.scaleViewport = true;
      this.client.viewOnly = true;
      this.client.addEventListener("connect", this.connectedEventFn);
      this.client.addEventListener("disconnect", this.disconnectEventFn);
    });
  }

  onClick() {
    this.loading$.next(true);
  }

  connectedEventFn = () => {
    this.init$.next(false);
  }

  disconnectEventFn = (event: CustomEvent<{ clean: boolean }>) => {
    if (!event.detail.clean) {
      this.err$.next(true);
    }
  }
}
