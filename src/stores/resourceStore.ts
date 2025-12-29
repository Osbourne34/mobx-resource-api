import { createAtom, type IAtom } from "mobx";

interface Options<TData> {
  queryFn: (options: { signal: AbortSignal }) => Promise<TData>;
}

export class ResourceStore<TData> {
  private atom: IAtom;

  private data: TData | undefined = undefined;
  private isLoading: boolean = false;
  private isError: boolean = false;
  private abortController = new AbortController();

  private readonly options: Options<TData>;

  constructor(options: Options<TData>) {
    this.options = options;
    this.atom = createAtom(
      "Resource",
      () => this.startTicking(),
      () => this.stopTicking()
    );
  }

  result() {
    this.atom.reportObserved();
    return {
      data: this.data,
      isLoading: this.isLoading,
      isError: this.isError,
      fetch: this.fetch.bind(this),
    };
  }

  private async fetch() {
    this.atom.reportChanged();

    this.isError = false;
    this.isLoading = true;
    this.data = undefined;

    try {
      const data = await this.options.queryFn({
        signal: this.abortController.signal,
      });
      this.data = data;
    } catch (error) {
      if (error.code === "ERR_CANCELED" && error.message === "message") return;
      this.isError = true;
    } finally {
      this.isLoading = false;
      this.atom.reportChanged();
    }
  }

  private startTicking(): void {
    this.fetch();
    console.log("startTicking");
  }

  private stopTicking() {
    this.data = undefined;

    if (this.isLoading) {
      this.abortController.abort();
      this.abortController = new AbortController();
    }

    console.log("stopTicking");
  }
}
