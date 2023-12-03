import { mock, type MockProxy } from 'jest-mock-extended'

import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import type { LoadFacebookUserApi } from '@/data/contracts/apis'

describe('FacebookAuthenticationService', () => {
  const token = 'valid_token'
  let loadFacebookUserApiSpy: MockProxy<LoadFacebookUserApi>
  let sut: FacebookAuthenticationService

  beforeEach(() => {
    loadFacebookUserApiSpy = mock()
    sut = new FacebookAuthenticationService(loadFacebookUserApiSpy)
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.execute({ token })

    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should throw AuthenticationError if token is expired or invalid', async () => {
    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.execute({ token: 'invalid-token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
