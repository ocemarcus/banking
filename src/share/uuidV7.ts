export async function uuidV7() {
  const { v7 } = await import('uuid');
  return v7()
}
