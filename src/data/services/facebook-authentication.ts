import type { FacebookAuthentication } from '@/domain/features'
import type { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import type { CreateFacebookAccountRepository, GetUserAccountRepository, UpdateFacebookAccountRepository } from '@/data/contracts/repositories'

type FacebookApi = LoadFacebookUserApi
type UserRepository = GetUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: FacebookApi,
    private readonly userAccountRepository: UserRepository
  ) {}

  async execute (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser(params)

    if (facebookData !== undefined) {
      const accountUserData = await this.userAccountRepository.get({ email: facebookData.email })

      if (accountUserData?.name !== undefined) {
        await this.userAccountRepository.updateWithFacebook({
          id: accountUserData.id,
          name: accountUserData.name,
          facebookId: facebookData.facebookId
        })
      }
      await this.userAccountRepository.createFromFacebook(facebookData)
    }

    return new AuthenticationError()
  }
}
