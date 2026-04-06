import fs from 'fs'
import path from 'path'

const ESCALATIONS_FILE = process.env.VERCEL
  ? '/tmp/escalations.json'
  : path.join(process.cwd(), 'escalations.json')

export async function GET() {
  try {
    const raw = fs.readFileSync(ESCALATIONS_FILE, 'utf8')
    const data = JSON.parse(raw)
    // Return in reverse chronological order
    return Response.json([...data].reverse())
  } catch {
    return Response.json([])
  }
}
