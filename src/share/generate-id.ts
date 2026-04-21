
import { simpleflake } from 'simpleflakes'

export async function generateId() {
  return simpleflake().toString()
}
