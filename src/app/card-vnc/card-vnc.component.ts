import {AfterViewInit, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-card-vnc',
  templateUrl: './card-vnc.component.html',
  styleUrl: './card-vnc.component.scss'
})
export class CardVncComponent implements OnInit {
  @Input()
  id: string
  @Input()
  ipAddressAndPort: string
  @Input()
  index: number;

  ngOnInit(): void {
  }
}
