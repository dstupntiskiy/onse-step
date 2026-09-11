import { DestroyRef, Directive, ElementRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { auditTime, distinctUntilChanged, fromEvent } from 'rxjs';

@Directive({
  selector: '[appScrollNearEnd]',
  standalone: true
})
export class ScrollNearEndDirective {
  nearEnd = output<void>()
  threshold = input(0.9)
  scrollDelay = input(200)

  private readonly elRef = inject(ElementRef).nativeElement as HTMLElement
  private readonly destroyRef = inject(DestroyRef)
  private readonly intersectionObserver: IntersectionObserver | null = null

  constructor() {
    const options = {
      root: this.elRef,
      rootMargin: '0px',
      threshold: this.threshold()
    }

    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      if(entry.isIntersecting){
        this.nearEnd.emit()
      }
    }, options)

    this.intersectionObserver.observe(this.elRef)

    fromEvent(this.elRef, 'scroll')
      .pipe(auditTime(this.scrollDelay()), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() =>{
        if (this.isNearBottom(this.elRef)){
          this.nearEnd.emit();
        }
      })
   }

  private isNearBottom(element: HTMLElement): boolean{
    const { scrollTop, clientHeight, scrollHeight} = element
    return scrollTop + clientHeight >= scrollHeight * this.threshold()
  }
}
