import { Redis } from '@upstash/redis'
const redis = new Redis({
  url: 'https://settled-coyote-286170.upstash.io',
  token: 'gQAAAAAABF3aAAIgcDI2YzA4ODNmZTFhZjg0YmEwYmE2MTJhNzIwN2I2N2Q3Ng',
})

export default redis