import { Component, model, effect, OnInit, ViewChild, ElementRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-speed-slider',
  imports: [FormsModule],
  templateUrl: './speed-slider.component.html',
  styleUrl: './speed-slider.component.css',
})
export class SpeedSliderComponent {

  speedSlider = viewChild.required<ElementRef>('speedSlider')

  speed = model.required<number>()

  constructor() {
    effect(() => {
      this.updateSliderGradient(this.speed())
    });
  }

  protected updateSliderGradient(speed: number) {
    const value = (speed / 126) * 100;
    this.speedSlider().nativeElement.style.setProperty('--value', `${value}%`);
  }


}
