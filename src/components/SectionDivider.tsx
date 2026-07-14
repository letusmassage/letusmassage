interface Props {
  src: string
  alt: string
}

export default function SectionDivider({ src, alt }: Props) {
  return (
    <div className="w-full overflow-hidden bg-stone-100">
      <picture className="contents">
      <source srcSet={src.replace(/\.jpg$/, '.webp')} type="image/webp" />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        width={1440}
        height={420}
        className="w-full h-[260px] md:h-[420px] object-cover"
      />
      </picture>
    </div>
  )
}
