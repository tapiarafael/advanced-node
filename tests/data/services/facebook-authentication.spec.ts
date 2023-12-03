import { mock, type MockProxy } from 'jest-mock-extended'

import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import type { LoadFacebookUserApi } from '@/data/contracts/apis'
import type { GetUserAccountRepository } from '@/data/contracts/repositories'

describe('FacebookAuthenticationService', () => {
  const token = 'valid_token'
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let getUserAccountRepository: MockProxy<GetUserAccountRepository>
  let sut: FacebookAuthenticationService

  beforeEach(() => {
    loadFacebookUserApi = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'valid_fb_name',
      email: 'valid_fb_email',
      facebookId: 'valid_fb_id'
    })
    getUserAccountRepository = mock()
    sut = new FacebookAuthenticationService(loadFacebookUserApi, getUserAccountRepository)
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.execute({ token })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should throw AuthenticationError if token is expired or invalid', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.execute({ token: 'invalid-token' })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call GetUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.execute({ token })

    expect(getUserAccountRepository.get).toHaveBeenCalledWith({ email: 'valid_fb_email' })
    expect(getUserAccountRepository.get).toHaveBeenCalledTimes(1)
  })
})
