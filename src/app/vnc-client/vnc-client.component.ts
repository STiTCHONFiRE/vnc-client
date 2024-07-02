import {AfterViewInit, Component, ElementRef, isDevMode, OnInit, ViewChild} from '@angular/core';
import NoVncClient from "@novnc/novnc/lib/rfb.js";
import {ActivatedRoute} from "@angular/router";
import {InfoPanelComponent} from "../info-panel/info-panel.component";

@Component({
  selector: 'app-vnc-client',
  templateUrl: './vnc-client.component.html',
  styleUrl: './vnc-client.component.scss'
})
export class VncClientComponent implements OnInit, AfterViewInit {
  @ViewChild('vnc')
  vnc: ElementRef<HTMLElement>;

  @ViewChild('modalClipboard')
  modalClipboard: ElementRef<HTMLDialogElement>;

  @ViewChild(InfoPanelComponent)
  infoPanel: InfoPanelComponent;

  private client: NoVncClient;
  private id: string;

  clipboard: string = "";

  err: boolean = false;
  loading: boolean = true;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
  }

  disconnect() {
    this.client.disconnect();
  }

  sendClipboard() {
    //console.log(this.clipboard)
    this.client.clipboardPasteFrom(this.clipboard)
  }

  ngAfterViewInit(): void {
    this.client = new NoVncClient(this.vnc.nativeElement as Element, `ws://localhost:8080/ws/${this.id}`)
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
      this.loading = false;
      this.modalClipboard.nativeElement.close();
      this.infoPanel.sendMessage("Ошибка подключения: что-то пошло не так, попробуйте позже", "ERR")
      this.err = true;
    }
  }

  connectedEventFn = () => {
    this.loading = false;
    this.infoPanel.sendMessage("Успешно подключено к удаленному компьютеру", "SUCCESS");
  }
}
