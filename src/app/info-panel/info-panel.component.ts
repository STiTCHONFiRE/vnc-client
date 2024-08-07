import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrl: './info-panel.component.scss'
})
export class InfoPanelComponent implements OnInit, OnDestroy {
  message$: BehaviorSubject<{ text: string, type: "ERR" | "SUCCESS" | "INFO" }>
    = new BehaviorSubject<{ text: string; type: "ERR" | "SUCCESS" | "INFO" }>({text: "", type: "INFO"});

  visible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  animating$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  hideTimeout: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.hideTimeout)
      clearTimeout(this.hideTimeout)
  }

  private showPanel() {
    this.animating$.next(true);
    this.visible$.next(true);

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    this.hideTimeout = setTimeout(() => {
      this.hidePanel();
    }, 3000); // Закрыть панель через 5 секунд
  }

  private hidePanel() {
    this.animating$.next(false);

    // Дождаться завершения анимации задвижения перед скрытием панели
    setTimeout(() => {
      this.visible$.next(false);
    }, 500); // Время для завершения анимации
  }

  public sendMessage(message: string, type: "ERR" | "SUCCESS" | "INFO") {
    this.message$.next({text: message, type: type});
    this.showPanel();
  }
}
