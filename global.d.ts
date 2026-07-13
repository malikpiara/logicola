declare module '*.css';

type StaticImageImport = {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
  blurWidth?: number;
  blurHeight?: number;
};

declare module '*.gif' {
  const content: StaticImageImport;
  export default content;
}

declare module '*.jpeg' {
  const content: StaticImageImport;
  export default content;
}

declare module '*.jpg' {
  const content: StaticImageImport;
  export default content;
}

declare module '*.png' {
  const content: StaticImageImport;
  export default content;
}
