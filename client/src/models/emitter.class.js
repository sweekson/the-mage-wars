export class Emitter extends EventTarget {
  on(type, listener) {
    this.addEventListener(type, listener);
  }

  emit(type, detail) {
    const event = new Event(type);
    event.detail = detail;
    this.dispatchEvent(event);
  }
}
