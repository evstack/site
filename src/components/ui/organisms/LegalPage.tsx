import fs from 'fs/promises'
import path from 'path'
import ReactMarkdown from 'react-markdown'

type LegalPageProps = {
  fileName: string
}

const contentDir = path.join(process.cwd(), 'src/content')

async function readMarkdownFile(fileName: string) {
  const filePath = path.join(contentDir, fileName)
  return fs.readFile(filePath, 'utf8')
}

export default async function LegalPage({ fileName }: LegalPageProps) {
  const markdown = await readMarkdownFile(fileName)

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
