declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.mp4" {
  const content: string;
  export default content;
}

declare module "*.module.scss" {
  const content: { [className: string]: string };
  export default content;
}
