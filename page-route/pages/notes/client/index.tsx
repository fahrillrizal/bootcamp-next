import useSWR from "swr"

type ListNotes = {
  id: string
  title: string
  description: string
  delete_at: string
  created_at: string
  updated_at: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function NoteClientPgae() {
  const { data, isLoading, error } = useSWR(
    "https://service.pace-unv.cloud/api/notes",
    fetcher, {
        // revalidateOnFocus: true,
        refreshInterval: 3000,
    }
  )

  if (isLoading) return <div>Loading...</div>

  if (error) return <div>Error</div>

  return (
    <div className="grid grid-cols-4 gap-4">
      {data?.data.map((note: ListNotes) => (
        <div key={note.id} className="p-4 bg-white rounded-lg shadow-sm">
          <h1>{note.title}</h1>
          <p>{note.description}</p>
        </div>
      ))}
    </div>
  )
}
