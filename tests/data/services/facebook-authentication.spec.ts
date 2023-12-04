import { mock, type MockProxy } from 'jest-mock-extended'

import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import type { LoadFacebookUserApi } from '@/data/contracts/apis'
import type { CreateFacebookAccountRepository, GetUserAccountRepository, UpdateFacebookAccountRepository } from '@/data/contracts/repositories'

describe('FacebookAuthenticationService', () => {
  const token = 'valid_token'
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepository: MockProxy<GetUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository>
  let sut: FacebookAuthenticationService

  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'valid_fb_name',
      email: 'valid_fb_email',
      facebookId: 'valid_fb_id'
    })
    userAccountRepository = mock()
    userAccountRepository.get.mockResolvedValue(undefined)
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepository)
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.execute({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should throw AuthenticationError if token is expired or invalid', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.execute({ token: 'invalid-token' })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call GetUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.execute({ token })

    expect(userAccountRepository.get).toHaveBeenCalledWith({ email: 'valid_fb_email' })
    expect(userAccountRepository.get).toHaveBeenCalledTimes(1)
  })

  it('should call CreateFacebookAccountRepository if GetUserAccountRepository returns undefined', async () => {
    await sut.execute({ token })

    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      name: 'valid_fb_name',
      email: 'valid_fb_email',
      facebookId: 'valid_fb_id'
    })
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call UpdateFacebookAccountRepository if GetUserAccountRepository returns data', async () => {
    userAccountRepository.get.mockResolvedValueOnce({
      id: 'valid_id',
      name: 'valid_name'
    })
    await sut.execute({ token })

    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledWith({
      id: 'valid_id',
      name: 'valid_name',
      facebookId: 'valid_fb_id'
    })
    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should update account name when account name is empty', async () => {
    userAccountRepository.get.mockResolvedValueOnce({
      id: 'valid_id'
    })
    await sut.execute({ token })

    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledWith({
      id: 'valid_id',
      name: 'valid_fb_name',
      facebookId: 'valid_fb_id'
    })
    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledTimes(1)
  })
})
