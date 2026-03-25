import ReactMarkdown from 'react-markdown'
import { legalPages, type LegalPageFileName } from '@/content/legal-pages'

type LegalPageProps = {
  fileName: LegalPageFileName
}

export default function LegalPage({ fileName }: LegalPageProps) {
  const markdown = legalPages[fileName]

  return (
    <main className="legal-page">
      <section className="legal-content-wrap">
        <div className="container">
          <article className="legal-content">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </article>
        </div>
      </section>
    </main>
  )
}
