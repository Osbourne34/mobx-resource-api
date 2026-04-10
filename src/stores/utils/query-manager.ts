import {
  action,
  computed,
  createAtom,
  makeObservable,
  observable,
  reaction,
  runInAction,
  type IAtom,
  type IReactionDisposer,
} from 'mobx'

interface Options<Data, Params, Mapper = Data> {
  queryFn: (options: { signal: AbortSignal; params?: Params }) => Promise<Data>
  params?: () => Params
  enabled?: () => boolean
  onSuccess?: (response: Mapper) => void
  onError?: (error: unknown) => void
  mapper?: (payload: Data) => Mapper
  initState?: Data
}

export class QueryManager<Data, Params, Mapper = Data> {
  private atom: IAtom

  @observable private _data: Data | undefined = undefined
  @observable private _isLoading: boolean = false
  @observable private _hasLoaded: boolean = false
  @observable private _isError: boolean = false
  private abortController: AbortController | null = null
  private reactionParams: IReactionDisposer | null = null

  private readonly options: Options<Data, Params, Mapper>

  constructor(options: Options<Data, Params, Mapper>) {
    this.options = options
    this._data = options.initState
    this.atom = createAtom(
      'QueryManager',
      () => this.startTicking(),
      () => this.stopTicking(),
    )
    makeObservable(this)
  }

  @computed
  private get _mappedData(): Mapper | undefined {
    if (this._data === undefined) return undefined
    return this.options.mapper
      ? this.options.mapper(this._data)
      : (this._data as unknown as Mapper)
  }

  get data(): Mapper | undefined {
    this.atom.reportObserved()
    return this._mappedData
  }

  get isLoading() {
    this.atom.reportObserved()
    return this._isLoading
  }

  get isInitialLoading() {
    this.atom.reportObserved()
    return this._isLoading && !this._hasLoaded
  }

  get isError() {
    this.atom.reportObserved()
    return this._isError
  }

  @action
  setData = (updater: Data | ((prev: Data | undefined) => Data)) => {
    const newState = updater instanceof Function ? updater(this._data) : updater

    this._data = newState
  }

  private async fetch(params?: Params) {
    this.abortController?.abort()

    this.abortController = new AbortController()
    const currentController = this.abortController

    runInAction(() => {
      this._isError = false
      this._isLoading = true
    })

    try {
      const data = await this.options.queryFn({
        signal: currentController.signal,
        params,
      })
      if (this.abortController === currentController) {
        runInAction(() => {
          this._data = data
          this._hasLoaded = true
        })

        this.options.onSuccess?.(this._mappedData as Mapper)
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return

      if (this.abortController === currentController) {
        runInAction(() => {
          this._isError = true
        })

        this.options.onError?.(error)
      }
    } finally {
      if (this.abortController === currentController) {
        runInAction(() => {
          this._isLoading = false
        })
      }
    }
  }

  refetch = async () => {
    await this.fetch(this.options.params?.())
    return this._mappedData
  }

  abort = () => {
    this.abortController?.abort()
    runInAction(() => {
      this._isLoading = false
    })
  }

  dispose = () => {
    this.stopTicking()
  }

  private startTicking(): void {
    this.reactionParams = reaction(
      () => {
        return {
          params: this.options.params?.(),
          enabled: this.options.enabled?.() ?? true,
        }
      },
      ({ params, enabled }) => {
        if (enabled) {
          this.fetch(params)
        } else {
          this.abortController?.abort()
        }
      },
      {
        fireImmediately: true,
      },
    )
  }

  private stopTicking() {
    this.reactionParams?.()
    this.reactionParams = null

    if (this.abortController && this._isLoading) {
      this.abortController.abort()
    }

    this.abortController = null

    runInAction(() => {
      this._data = this.options.initState
      this._isLoading = false
      this._hasLoaded = false
      this._isError = false
    })
  }
}
