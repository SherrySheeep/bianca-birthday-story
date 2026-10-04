declare module "virtual:public-image-manifest" {
  const assets: Array<{ url: string; bytes: number; priority: boolean }>;
  export default assets;
}
