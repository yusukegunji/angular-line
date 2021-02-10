import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const fade = trigger('fade', [
  transition('void => *', [
    style({ opacity: 0 }),
    animate('.5s ease-in-out', style({ opacity: 1 })),
  ]),
  transition('* => void', [animate('.5s ease-in-out', style({ opacity: 0 }))]),
]);

export const easeSlideForSideNav = trigger('easeSlideForSideNav', [
  state(
    'close',
    style({
      width: '72px',
    })
  ),
  state(
    'open',
    style({
      width: '240px',
    })
  ),
  transition('close => open', animate('.16s ease-in')),
  transition('open => close', animate('.16s ease-out')),
]);

export const easeSlideForContent = trigger('easeSlideForContent', [
  state(
    'close',
    style({
      'margin-left': '72px',
    })
  ),
  state(
    'open',
    style({
      'margin-left': '240px',
    })
  ),
  transition('close => open', animate('.16s ease-out')),
  transition('open => close', animate('.16s ease-out')),
]);
