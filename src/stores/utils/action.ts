import { createAtom, type IAtom } from 'mobx'

type Options<TVariables, TData> = {
  actionFn: (variables: TVariables) => Promise<TData>
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: unknown, variables: TVariables) => void
}

export class AsyncAction<TVariables, TData> {
  private atom: IAtom

  private _isLoading: boolean = false
  private _isError: boolean = false

  private readonly options: Options<TVariables, TData>

  constructor(options: Options<TVariables, TData>) {
    this.options = options
    this.atom = createAtom('Mutation')
  }

  get isLoading() {
    this.atom.reportObserved()
    return this._isLoading
  }

  get isError() {
    this.atom.reportObserved()
    return this._isError
  }

  action = async (variables: TVariables) => {
    this.atom.reportChanged()

    try {
      this._isError = false
      this._isLoading = true
      const result = await this.options.actionFn(variables)
      this.options.onSuccess?.(result, variables)
      return result
    } catch (error) {
      this._isError = true
      this.options.onError?.(error, variables)
    } finally {
      this._isLoading = false
      this.atom.reportChanged()
    }
  }
}
