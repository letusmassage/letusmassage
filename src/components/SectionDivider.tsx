interface Props {
  src: string
  alt: string
}

export default function SectionDivider({ src, alt }: Props) {
  return (
    <div className="w-full overflow-hidden bg-stone-100">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-[260px] md:h-[420px] object-cover"
      />
    </div>
  )
}
