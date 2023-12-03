import { mock, type MockProxy } from 'jest-mock-extended'

import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import type { LoadFacebookUserApi } from '@/data/contracts/apis'

type SutTypes = {
  sut: FacebookAuthenticationService
  loadFacebookUserApiSpy: MockProxy<LoadFacebookUserApi>
}

const makeSut = (): SutTypes => {
  const loadFacebookUserApiSpy = mock<LoadFacebookUserApi>()
  const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy)

  return {
    sut,
    loadFacebookUserApiSpy
  }
}

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const { loadFacebookUserApiSpy, sut } = makeSut()
    await sut.execute({ token: 'valid-token' })

    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({ token: 'valid-token' })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should throw AuthenticationError if token is expired or invalid', async () => {
    const { loadFacebookUserApiSpy, sut } = makeSut()
    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.execute({ token: 'invalid-token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
