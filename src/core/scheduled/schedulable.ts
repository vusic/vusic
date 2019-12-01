import * as t from 'io-ts';
import * as Audio from '@/modules/audio';
import { StrictEventEmitter } from '@/modules/audio/events';
import { Beat } from '@/modules/audio/types';

export const SchedulableType = t.type({
  row: t.number,
  time: t.number,
  duration: t.number,
});

export type ISchedulable = t.TypeOf<typeof SchedulableType>;

export abstract class Schedulable extends StrictEventEmitter<{ remove: [] }> {
  /**
   * The component name to mount in the `Sequencer`.
   */
  public readonly abstract component: string;

  /**
   * Refers to row where the element is placed.
   * For notes, these are numbered 0 -> 87 and start from the higher frequencies.
   */
  public row: number;

  // tslint:disable-next-line:variable-name
  private _time: number;

  /**
   * Private duration in beats.
   */
  private beats: number;
  private controller?: Audio.TransportEventController;

  constructor(i: ISchedulable) {
    super();
    this.row = i.row;
    this._time = i.time;
    this.beats = i.duration;
    this.duration = i.duration;
  }

  /**
   * Duration in beats.
   */
  get duration() {
    return this.beats;
  }

  set duration(value: number) {
    this.beats = value;
    if (this.controller) {
      this.controller.setDuration(value);
    }
  }

  /**
   * Time in beats.
   */
  get time() {
    return this._time;
  }

  set time(time: Beat) {
    this._time = time;
    if (this.controller) {
      this.controller.setDuration(time);
    }
  }

  get endBeat() {
    return this.time + this.duration;
  }

  public remove() {
    if (this.controller) {
      this.controller.remove();
      this.emit('remove');
    }
  }

  public schedule(transport: Audio.Transport) {
    this.controller = this.add(transport);
  }

  public dispose() {
    this.remove();
    super.dispose();
  }

  public abstract copy(): Schedulable;

  /**
   * Add yourself to the transport. Return null if it's not possible.
   *
   * @param transport The target transport.
   */
  protected abstract add(transport: Audio.Transport): Audio.TransportEventController | undefined;
}
