import { Schedulable } from '@/core/scheduled/schedulable';
import { Transport } from '@/modules/audio/transport';
import { StrictEventEmitter } from '@/modules/audio/events';


const watchElement = <T extends Schedulable>(elements: T[], element: T, onRemove: (event: T) => void) => {
  const disposer = element.on('remove', () => {
    const i = elements.indexOf(element);
    if (i >= 0) {
      onRemove(element);
      elements.splice(i, 1);
    }
    disposer.dispose();
  });
};

export class Sequence<T extends Schedulable> extends StrictEventEmitter<{ added: [T], removed: [T] }> {
  public map = this.elements.map.bind(this.elements);
  public filter = this.elements.filter.bind(this.elements);
  public forEach = this.elements.forEach.bind(this.elements);
  public slice = this.elements.slice.bind(this.elements);

  constructor(private transport: Transport, public elements: T[]) {
    super();
    elements.forEach((e) => watchElement(elements, e, this.onRemove.bind(this)));
  }

  public push(element: T) {
    this.elements.push(element);
    element.schedule(this.transport);
    watchElement(this.elements, element, this.onRemove.bind(this));
    this.emit('added', element);
  }

  private onRemove(element: T) {
    this.emit('removed', element);
  }
}
