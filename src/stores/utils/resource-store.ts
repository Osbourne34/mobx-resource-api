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

interface Options<TData, TParams, TMapper = TData> {
  queryFn: (options: {
    signal: AbortSignal
    params?: TParams
  }) => Promise<TData>
  params?: () => TParams
  enabled?: () => boolean
  onSuccess?: (response: TMapper) => void
  onError?: (error: unknown) => void
  mapper?: (payload: TData) => TMapper
  initState?: TData
}

export class ResourceStore<TData, TParams, TMapper = TData> {
  private atom: IAtom

  @observable private _data: TData | undefined = undefined
  @observable private _isLoading: boolean = false
  @observable private _hasLoaded: boolean = false
  @observable private _isError: boolean = false
  private abortController: AbortController | null = null
  private reactionParams: IReactionDisposer | null = null

  private readonly options: Options<TData, TParams, TMapper>

  constructor(options: Options<TData, TParams, TMapper>) {
    this.options = options
    this._data = options.initState
    this.atom = createAtom(
      'Resource',
      () => this.startTicking(),
      () => this.stopTicking(),
    )
    makeObservable(this)
  }

  @computed
  private get _mappedData(): TMapper | undefined {
    if (this._data === undefined) return undefined
    return this.options.mapper
      ? this.options.mapper(this._data)
      : (this._data as unknown as TMapper)
  }

  get data(): TMapper | undefined {
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
  setData = (updater: TData | ((prev: TData | undefined) => TData)) => {
    const newState = updater instanceof Function ? updater(this._data) : updater

    this._data = newState
  }

  private async fetch(params?: TParams) {
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

        this.options.onSuccess?.(this._mappedData as TMapper)

        return data
      }
    } catch (error) {
      if (currentController.signal.aborted) return

      if (this.abortController === currentController) {
        runInAction(() => {
          this._isError = true
          this.options.onError?.(error)
        })
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
  }

  dispose() {
    this.stopTicking()
  }

  private startTicking(): void {
    console.log('startTicking')

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
    console.log('stopTicking')

    this.reactionParams?.()
    this.reactionParams = null

    if (this.abortController && this._isLoading) {
      this.abortController.abort()
      this.abortController = null
    }

    runInAction(() => {
      this._data = this.options.initState
      this._isLoading = false
      this._hasLoaded = false
      this._isError = false
    })
  }
}
