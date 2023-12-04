import type { FacebookAuthentication } from '@/domain/features'
import type { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import type { SaveFacebookAccountRepository, GetUserAccountRepository } from '@/data/contracts/repositories'

type FacebookApi = LoadFacebookUserApi
type UserRepository = GetUserAccountRepository & SaveFacebookAccountRepository

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: FacebookApi,
    private readonly userAccountRepository: UserRepository
  ) {}

  async execute (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser(params)

    if (facebookData !== undefined) {
      const accountUserData = await this.userAccountRepository.get({ email: facebookData.email })

      await this.userAccountRepository.saveWithFacebook({
        id: accountUserData?.id,
        name: accountUserData?.name ?? facebookData.name,
        email: facebookData.email,
        facebookId: facebookData.facebookId
      })
    }

    return new AuthenticationError()
  }
}
