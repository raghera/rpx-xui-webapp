import { Component, ViewEncapsulation } from '@angular/core';
import { LoggerService } from '../../services/logger/logger.service';

@Component({
  selector: 'exui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(private logger: LoggerService) {
    logger.debug('AppComponent: logger.debug()');
    logger.trace('AppComponent: logger.trace()');
    logger.info('AppComponent: logger.info()');
    logger.warn('AppComponent: logger.warn()');
    logger.error('AppComponent: logger.error()');
    logger.fatal('AppComponent: logger.fatal()');
  }
}
