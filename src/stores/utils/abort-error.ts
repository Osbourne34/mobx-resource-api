export class AbortError extends DOMException {
  constructor(message: string) {
    super(message, 'AbortError')
  }
}
