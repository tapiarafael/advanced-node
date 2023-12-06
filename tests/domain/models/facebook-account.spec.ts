import { FacebookAccount } from '@/domain/models'

describe('FacebookModel', () => {
  const fbData = {
    email: 'valid_fb_email',
    name: 'valid_fb_name',
    facebookId: 'valid_fb_id'
  }

  it('should create with facebook data only', () => {
    const sut = new FacebookAccount(fbData)

    expect(sut).toEqual({
      email: 'valid_fb_email',
      name: 'valid_fb_name',
      facebookId: 'valid_fb_id'
    })
  })

  it('should update name if is empty', () => {
    const accountData = { id: 'valid_id' }
    const sut = new FacebookAccount(fbData, accountData)

    expect(sut).toEqual({
      id: 'valid_id',
      email: 'valid_fb_email',
      name: 'valid_fb_name',
      facebookId: 'valid_fb_id'
    })
  })

  it('should not update name if is exists', () => {
    const accountData = {
      id: 'valid_id',
      name: 'valid_name'
    }
    const sut = new FacebookAccount(fbData, accountData)

    expect(sut).toEqual({
      id: 'valid_id',
      email: 'valid_fb_email',
      name: 'valid_name',
      facebookId: 'valid_fb_id'
    })
  })
})
