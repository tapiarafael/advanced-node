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

export interface CreateFacebookAccountRepository {
  createFromFacebook: (params: CreateFacebookAccountRepository.Params) => Promise<CreateFacebookAccountRepository.Result>
}

export namespace CreateFacebookAccountRepository {
  export type Params = {
    name: string
    email: string
    facebookId: string
  }
  export type Result = undefined
}
