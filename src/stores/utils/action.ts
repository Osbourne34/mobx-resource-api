import { makeObservable, observable, runInAction } from 'mobx'

type Options<Variables, Data> = {
  actionFn: (variables: Variables) => Promise<Data>
  onSuccess?: (data: Data, variables: Variables) => void
  onError?: (error: unknown, variables: Variables) => void
}

export class AsyncAction<Variables, Data> {
  @observable private _isLoading: boolean = false
  @observable private _isError: boolean = false

  private readonly options: Options<Variables, Data>

  constructor(options: Options<Variables, Data>) {
    this.options = options
    makeObservable(this)
  }

  get isLoading() {
    return this._isLoading
  }

  get isError() {
    return this._isError
  }

  action = async (variables: Variables) => {
    runInAction(() => {
      this._isError = false
      this._isLoading = true
    })

    try {
      const result = await this.options.actionFn(variables)

      this.options.onSuccess?.(result, variables)

      return result
    } catch (error) {
      runInAction(() => {
        this._isError = true
      })

      this.options.onError?.(error, variables)
    } finally {
      runInAction(() => {
        this._isLoading = false
      })
    }
  }
}
