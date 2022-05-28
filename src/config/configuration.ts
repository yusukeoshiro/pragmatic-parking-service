export default () => {
  if (!process.env.IMAGE_BUCKET) throw new Error(`IMAGE_BUCKET not set`)

  return {
    port: parseInt(process.env.PORT, 10) || 8080,
    imagesBucket: process.env.IMAGE_BUCKET,
  }
}
