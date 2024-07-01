import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import NoVncClient from "@novnc/novnc/lib/rfb.js";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-vnc-client',
  templateUrl: './vnc-client.component.html',
  styleUrl: './vnc-client.component.scss'
})
export class VncClientComponent implements OnInit, AfterViewInit {
  @ViewChild('vnc')
  vnc: ElementRef<HTMLElement>;
  private client: NoVncClient;
  private id: string;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
  }

  disconnect() {
    this.client.disconnect();
  }

  ngAfterViewInit(): void {
    this.client = new NoVncClient(this.vnc.nativeElement as Element, `ws://localhost:8080/ws/${this.id}`)
    this.client.clipViewport = true;
    this.client.scaleViewport = true;
  }

}
