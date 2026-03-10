
import { simpleflake } from 'simpleflakes'

export async function uuidV7() {
  return simpleflake().toString()
}
