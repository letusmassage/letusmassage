import { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import JSZip from 'jszip'
import { imageGroups } from '../admin/imageManifest'
import type { SwappableImage } from '../admin/imageManifest'

// ---------------------------------------------------------------------------
// Lösenord till admin-sidan. Byt gärna till något eget.
// Obs: admin-sidan skapar bara nedladdningar – ingen känslig data kan läcka,
// så ett enkelt delat lösenord räcker.
// ---------------------------------------------------------------------------
const ADMIN_PASSWORD = 'massage2026'

// Nyckel där ett eget lösenord sparas i webbläsaren.
const PW_STORAGE_KEY = 'lum-admin-pw'

// Nuvarande lösenord: ett eget (sparat i webbläsaren) går före standardlösenordet.
function currentPassword(): string {
  return localStorage.getItem(PW_STORAGE_KEY) || ADMIN_PASSWORD
}

interface Selection {
  file: File
  url: string
  width: number
  height: number
}

function extOf(name: string): string {
  const i = name.lastIndexOf('.')
  return i >= 0 ? name.slice(i + 1).toLowerCase() : ''
}

function sameKind(a: string, b: string): boolean {
  const norm = (e: string) => (e === 'jpeg' ? 'jpg' : e)
  return norm(a) === norm(b)
}

// Läser in en vald bildfil och tar reda på dess mått.
function readImage(file: File): Promise<Selection> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () =>
      resolve({ file, url, width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Kunde inte läsa bilden'))
    }
    img.src = url
  })
}

// --- Ett bildkort -----------------------------------------------------------

interface CardProps {
  image: SwappableImage
  selection?: Selection
  onPick: (file: File) => void
  onUndo: () => void
}

function ImageCard({ image, selection, onPick, onUndo }: CardProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const extMismatch =
    selection !== undefined &&
    !sameKind(extOf(image.path), extOf(selection.file.name))

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col">
      <div className="px-5 pt-5">
        <h3 className="font-serif text-xl text-slate-800">{image.label}</h3>
        <p className="text-sm text-slate-500 mt-1">{image.where}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-5">
        <figure className="m-0">
          <div className="aspect-video bg-stone-100 rounded-lg overflow-hidden">
            <img
              src={'/' + image.path}
              alt={`Nuvarande ${image.label}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.visibility = 'hidden'
              }}
            />
          </div>
          <figcaption className="text-xs text-slate-400 mt-1.5 text-center">
            Nuvarande
          </figcaption>
        </figure>

        <figure className="m-0">
          <div
            className={
              'aspect-video rounded-lg overflow-hidden flex items-center justify-center ' +
              (selection
                ? 'bg-stone-100 ring-2 ring-emerald-500'
                : 'bg-stone-50 border border-dashed border-stone-300')
            }
          >
            {selection ? (
              <img
                src={selection.url}
                alt={`Ny ${image.label}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-xs text-slate-400 px-2 text-center">
                Ingen ny bild vald
              </span>
            )}
          </div>
          <figcaption className="text-xs mt-1.5 text-center">
            {selection ? (
              <span className="text-emerald-700 font-medium">
                Ny bild · {selection.width} × {selection.height} px
              </span>
            ) : (
              <span className="text-slate-400">Förhandsvisning</span>
            )}
          </figcaption>
        </figure>
      </div>

      {extMismatch && (
        <p className="mx-5 mb-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Originalet är en <strong>.{extOf(image.path)}</strong>-fil men du valde
          en <strong>.{extOf(selection!.file.name)}</strong>-fil. Det fungerar
          oftast ändå, men samma filtyp är säkrast.
        </p>
      )}

      <div className="mt-auto px-5 pb-5">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onPick(file)
              e.target.value = ''
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex-1 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2.5 rounded-full transition-colors"
          >
            {selection ? 'Välj en annan' : 'Välj ny bild'}
          </button>
          {selection && (
            <button
              type="button"
              onClick={onUndo}
              className="text-sm text-slate-500 hover:text-slate-800 font-medium px-4 py-2.5 rounded-full border border-stone-300 transition-colors"
            >
              Ångra
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-2.5">{image.hint}</p>
      </div>
    </div>
  )
}

// --- Inloggning -------------------------------------------------------------

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (pw === currentPassword()) {
            sessionStorage.setItem('lum-admin-ok', '1')
            onSuccess()
          } else {
            setError(true)
          }
        }}
        className="bg-white rounded-2xl border border-stone-200 p-8 w-full max-w-sm"
      >
        <h1 className="font-serif text-2xl text-slate-800">Bildhantering</h1>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Logga in för att byta bilder på hemsidan.
        </p>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Lösenord
        </label>
        <input
          type="password"
          value={pw}
          autoFocus
          onChange={(e) => {
            setPw(e.target.value)
            setError(false)
          }}
          className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        {error && (
          <p className="text-sm text-red-600 mt-2">Fel lösenord, försök igen.</p>
        )}
        <button
          type="submit"
          className="w-full mt-5 bg-sky-600 hover:bg-sky-700 text-white font-medium px-4 py-2.5 rounded-full transition-colors"
        >
          Logga in
        </button>
      </form>
    </div>
  )
}

// --- Byt lösenord -----------------------------------------------------------

function PwField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
    </div>
  )
}

function ChangePassword() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const customSet = localStorage.getItem(PW_STORAGE_KEY) !== null

  function clearFields() {
    setCurrent('')
    setNext('')
    setConfirm('')
  }

  return (
    <section className="bg-white rounded-2xl border border-stone-200 p-6 mb-10">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o)
          setMsg(null)
        }}
        className="flex items-center justify-between w-full text-left"
      >
        <h2 className="font-serif text-xl text-slate-800">Byt lösenord</h2>
        <span className="text-sm text-sky-600 font-medium">
          {open ? 'Dölj' : 'Visa'}
        </span>
      </button>

      {open && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (current !== currentPassword()) {
              setMsg({ ok: false, text: 'Nuvarande lösenord stämmer inte.' })
              return
            }
            if (next.length < 4) {
              setMsg({
                ok: false,
                text: 'Nytt lösenord måste vara minst 4 tecken.',
              })
              return
            }
            if (next !== confirm) {
              setMsg({ ok: false, text: 'De nya lösenorden matchar inte.' })
              return
            }
            localStorage.setItem(PW_STORAGE_KEY, next)
            clearFields()
            setMsg({
              ok: true,
              text: 'Lösenordet är ändrat. Det används nästa gång du loggar in.',
            })
          }}
          className="mt-4 max-w-sm space-y-3"
        >
          <PwField
            label="Nuvarande lösenord"
            value={current}
            onChange={setCurrent}
          />
          <PwField label="Nytt lösenord" value={next} onChange={setNext} />
          <PwField
            label="Upprepa nytt lösenord"
            value={confirm}
            onChange={setConfirm}
          />

          {msg && (
            <p
              className={
                'text-sm ' + (msg.ok ? 'text-emerald-700' : 'text-red-600')
              }
            >
              {msg.text}
            </p>
          )}

          <div className="flex items-center gap-4 pt-1">
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
            >
              Spara nytt lösenord
            </button>
            {customSet && (
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem(PW_STORAGE_KEY)
                  clearFields()
                  setMsg({
                    ok: true,
                    text: 'Återställt till standardlösenordet.',
                  })
                }}
                className="text-sm text-slate-500 hover:text-slate-800 font-medium"
              >
                Återställ till standardlösenord
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400 pt-1">
            Lösenordet sparas i den här webbläsaren. På en annan dator eller
            webbläsare gäller fortfarande det vanliga lösenordet.
          </p>
        </form>
      )}
    </section>
  )
}

// --- Admin-sidan ------------------------------------------------------------

export default function Admin() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('lum-admin-ok') === '1',
  )
  const [selections, setSelections] = useState<Record<string, Selection>>({})
  const [busy, setBusy] = useState(false)

  // Städar bort förhandsvisningar ur minnet när sidan stängs.
  const selRef = useRef(selections)
  useEffect(() => {
    selRef.current = selections
  }, [selections])
  useEffect(() => {
    return () => {
      Object.values(selRef.current).forEach((s) => URL.revokeObjectURL(s.url))
    }
  }, [])

  async function pick(path: string, file: File) {
    try {
      const sel = await readImage(file)
      setSelections((prev) => {
        const old = prev[path]
        if (old) URL.revokeObjectURL(old.url)
        return { ...prev, [path]: sel }
      })
    } catch {
      alert('Kunde inte läsa bildfilen. Välj en annan bild.')
    }
  }

  function undo(path: string) {
    setSelections((prev) => {
      const old = prev[path]
      if (old) URL.revokeObjectURL(old.url)
      const next = { ...prev }
      delete next[path]
      return next
    })
  }

  async function downloadZip() {
    setBusy(true)
    try {
      const zip = new JSZip()
      for (const [path, sel] of Object.entries(selections)) {
        zip.file('public/' + path, sel.file)
      }
      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'letusmassage-bilder.zip'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setBusy(false)
    }
  }

  const count = Object.keys(selections).length

  if (!authed) {
    return (
      <>
        <Helmet>
          <title>Bildhantering – Let Us Massage</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <LoginScreen onSuccess={() => setAuthed(true)} />
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Bildhantering – Let Us Massage</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-stone-100 pb-28">
        <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="font-serif text-xl text-slate-800">Bildhantering</h1>
              <p className="text-xs text-slate-500">Let Us Massage</p>
            </div>
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem('lum-admin-ok')
                setAuthed(false)
              }}
              className="text-sm text-slate-500 hover:text-slate-800 font-medium"
            >
              Logga ut
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-sky-50 border border-sky-100 rounded-2xl px-5 py-4 mb-8">
            <p className="text-sm text-slate-700">
              Byt en bild genom att klicka <strong>Välj ny bild</strong> under
              den. Du ser direkt hur den nya bilden ser ut. När du är klar
              klickar du på knappen längst ner för att ladda ner dina ändringar.
            </p>
          </div>

          {imageGroups.map((group) => (
            <section key={group.title} className="mb-10">
              <h2 className="font-serif text-2xl text-slate-800 mb-4">
                {group.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {group.images.map((image) => (
                  <ImageCard
                    key={image.path}
                    image={image}
                    selection={selections[image.path]}
                    onPick={(file) => pick(image.path, file)}
                    onUndo={() => undo(image.path)}
                  />
                ))}
              </div>
            </section>
          ))}

          <ChangePassword />

          <section className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="font-serif text-xl text-slate-800 mb-3">
              Så lägger du in de nya bilderna
            </h2>
            <ol className="text-sm text-slate-600 space-y-2 list-decimal pl-5">
              <li>
                Klicka på knappen <strong>Ladda ner ändrade bilder</strong> längst
                ner. Du får en ZIP-fil.
              </li>
              <li>
                Skicka ZIP-filen till den som sköter hemsidan – eller packa upp
                den själv.
              </li>
              <li>
                I ZIP-filen ligger en mapp som heter <code>public</code>. Lägg in
                dess innehåll i projektets <code>public</code>-mapp och skriv över
                de gamla bilderna.
              </li>
              <li>
                Hemsidan byggs om automatiskt och de nya bilderna syns inom någon
                minut.
              </li>
            </ol>
          </section>
        </main>

        {count > 0 && (
          <div className="fixed bottom-0 inset-x-0 bg-white border-t border-stone-200 shadow-lg">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
              <span className="text-sm text-slate-600">
                {count === 1
                  ? '1 bild vald för byte'
                  : `${count} bilder valda för byte`}
              </span>
              <button
                type="button"
                onClick={downloadZip}
                disabled={busy}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors whitespace-nowrap"
              >
                {busy ? 'Skapar fil…' : 'Ladda ner ändrade bilder (ZIP)'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
