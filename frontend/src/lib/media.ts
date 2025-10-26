import type { Picture } from "imagetools-core";

const MIME_TYPES: Record<string, string> = {
  avif: "image/avif",
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

export type PictureSource = {
  type: string;
  srcSet: string;
  media?: string;
};

export type PictureAttributes = {
  defaultSrc: string;
  width: number;
  height: number;
  sources: PictureSource[];
  img: {
    src: string;
    alt: string;
    srcSet?: string;
    sizes?: string;
    width: number;
    height: number;
  };
};

export type PictureOptions = {
  alt: string;
  sizes?: string;
  fallbackFormat?: string;
  mediaByFormat?: Record<string, string>;
};

export function createPictureAttributes(
  picture: Picture,
  { alt, sizes, fallbackFormat, mediaByFormat = {} }: PictureOptions,
): PictureAttributes {
  const entries = Object.entries(picture.sources);
  if (entries.length === 0) {
    return {
      defaultSrc: picture.img.src,
      width: picture.img.w,
      height: picture.img.h,
      sources: [],
      img: {
        src: picture.img.src,
        alt,
        width: picture.img.w,
        height: picture.img.h,
        sizes,
      },
    };
  }

  const ordered = entries.sort((a, b) => formatWeight(a[0]) - formatWeight(b[0]));
  const sources: PictureSource[] = ordered.map(([format, srcSet]) => ({
    type: MIME_TYPES[format] ?? `image/${format}`,
    srcSet,
    media: mediaByFormat[format],
  }));

  const fallbackKey = fallbackFormat ?? ordered[ordered.length - 1]?.[0];
  const fallbackSrcSet = fallbackKey ? picture.sources[fallbackKey] : undefined;

  return {
    defaultSrc: picture.img.src,
    width: picture.img.w,
    height: picture.img.h,
    sources,
    img: {
      src: picture.img.src,
      alt,
      srcSet: fallbackSrcSet,
      sizes,
      width: picture.img.w,
      height: picture.img.h,
    },
  };
}

function formatWeight(format: string): number {
  switch (format) {
    case "avif":
      return 0;
    case "webp":
      return 1;
    default:
      return 2;
  }
}
