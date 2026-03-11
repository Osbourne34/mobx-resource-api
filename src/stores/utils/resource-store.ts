import { createAtom, reaction, type IAtom, type IReactionDisposer } from 'mobx'

interface Options<TData, TParams, TMapper = TData> {
  queryFn: (options: {
    signal: AbortSignal
    params?: TParams
  }) => Promise<TData>
  params?: () => TParams
  enabled?: () => boolean
  onSuccess?: (response: TData) => void
  onError?: (error: unknown) => void
  mapper?: (payload: TData) => TMapper
}

export class ResourceStore<TData, TParams, TMapper = TData> {
  private atom: IAtom

  private _data: TData | undefined = undefined
  private _isLoading: boolean = false
  private _isError: boolean = false
  private abortController: AbortController | null = null
  private reactionParamms: IReactionDisposer | null = null

  private readonly options: Options<TData, TParams, TMapper>

  constructor(options: Options<TData, TParams, TMapper>) {
    this.options = options
    this.atom = createAtom(
      'Resource',
      () => this.startTicking(),
      () => this.stopTicking(),
    )
  }

  private mapData(data: TData): TMapper {
    return this.options.mapper
      ? this.options.mapper(data)
      : (data as unknown as TMapper)
  }

  get data(): TMapper | undefined {
    this.atom.reportObserved()
    if (this._data === undefined) return undefined
    return this.mapData(this._data)
  }

  get isLoading() {
    this.atom.reportObserved()
    return this._isLoading
  }

  get isError() {
    this.atom.reportObserved()
    return this._isError
  }

  refetch = this.fetch.bind(this)

  private async fetch() {
    this.atom.reportChanged()

    if (this.abortController) {
      this.abortController?.abort()
    }

    this.abortController = new AbortController()
    const currentController = this.abortController

    this._isError = false
    this._isLoading = true
    this._data = undefined

    try {
      const data = await this.options.queryFn({
        signal: currentController.signal,
        params: this.options.params?.(),
      })
      if (this.abortController === currentController) {
        this._data = data

        this.options.onSuccess?.(data)
      }
    } catch (error) {
      const err = error as { code: string }
      if (err.code === 'ERR_CANCELED') return

      if (this.abortController === currentController) {
        this._isError = true

        this.options.onError?.(error)
      }
    } finally {
      if (this.abortController === currentController) {
        this._isLoading = false
        this.atom.reportChanged()
      }
    }
  }

  private startTicking(): void {
    console.log('startTicking')

    this.reactionParamms = reaction(
      () => {
        return {
          params: this.options.params?.(),
          enabled: this.options.enabled?.() ?? true,
        }
      },
      ({ enabled }) => {
        if (enabled) {
          this.fetch()
        }
      },
      {
        fireImmediately: true,
      },
    )
  }

  private stopTicking() {
    console.log('stopTicking')
    this.reactionParamms?.()
    this.reactionParamms = null
    this._data = undefined

    if (this.abortController && this._isLoading) {
      this.abortController?.abort()
      this.abortController = null
    }
  }
}
