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
  isVisible: boolean = false;
  isAnimating: boolean = false;
  hideTimeout: any;

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.hideTimeout)
      clearTimeout(this.hideTimeout)
  }

  private showPanel() {
    this.isAnimating = true;
    this.isVisible = true;

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    this.hideTimeout = setTimeout(() => {
      this.hidePanel();
    }, 3000); // Закрыть панель через 5 секунд
  }

  private hidePanel() {
    this.isAnimating = false;

    // Дождаться завершения анимации задвижения перед скрытием панели
    setTimeout(() => {
      this.isVisible = false;
    }, 500); // Время для завершения анимации
  }

  public sendMessage(message: string, type: "ERR" | "SUCCESS" | "INFO") {
    this.message$.next({text: message, type: type});
    this.showPanel();
  }
}
