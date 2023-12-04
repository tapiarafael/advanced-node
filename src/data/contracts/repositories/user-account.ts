export interface GetUserAccountRepository {
  get: (params: GetUserAccountRepository.Params) => Promise<GetUserAccountRepository.Result>
}

export namespace GetUserAccountRepository {
  export type Params = { email: string }
  export type Result = undefined | {
    id: string
    name?: string
  }
}

export interface SaveFacebookAccountRepository {
  saveWithFacebook: (params: SaveFacebookAccountRepository.Params) => Promise<SaveFacebookAccountRepository.Result>
}

export namespace SaveFacebookAccountRepository {
  export type Params = {
    id?: string
    name: string
    email: string
    facebookId: string
  }
  export type Result = undefined
}
