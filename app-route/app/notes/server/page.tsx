async function getNotes() {
  const notes = await fetch("https://service.pace-unv.cloud/api/notes").then(
    (res) => res.json()
  )

  return notes
}

export default async function Notes() {
  const notes = await getNotes()

  return (
    <ul>
      {notes.data.map((el: { id: string; title: string }) => (
        <li key={el.id}>{el.title}</li>
      ))}
    </ul>
  )
}
