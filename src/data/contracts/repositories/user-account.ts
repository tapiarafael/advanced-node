export interface GetUserAccountRepository {
  get: (params: GetUserAccountRepository.Params) => Promise<GetUserAccountRepository.Result>
}

export namespace GetUserAccountRepository {
  export type Params = { email: string }
  export type Result = undefined | {
    id: string
    name?: string
    email?: string
  }
}
