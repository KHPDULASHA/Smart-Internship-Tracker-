type PageHeadingProps = {
  title: string
  subtitle?: string
}

export function PageHeading({ title, subtitle }: PageHeadingProps) {
  return (
    <header style={{ marginBottom: '1.25rem' }}>
      <h1 style={{ margin: 0 }}>{title}</h1>
      {subtitle ? <p style={{ marginTop: '0.35rem', color: '#555' }}>{subtitle}</p> : null}
    </header>
  )
}
