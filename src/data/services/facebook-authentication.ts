import type { FacebookAuthentication } from '@/domain/features'
import type { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import type { CreateFacebookAccountRepository, GetUserAccountRepository } from '@/data/contracts/repositories'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly getUserAccountRepository: GetUserAccountRepository,
    private readonly createFacebookAccountRepository: CreateFacebookAccountRepository
  ) {}

  async execute (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.loadFacebookUserApi.loadUser(params)

    if (facebookData !== undefined) {
      await this.getUserAccountRepository.get({ email: facebookData.email })
      await this.createFacebookAccountRepository.createFromFacebook(facebookData)
    }

    return new AuthenticationError()
  }
}
