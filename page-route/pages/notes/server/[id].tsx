import {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next";


type ListNotes = {
  id: string;
  title: string;
  description: string;
  delete_at: string;
  created_at: string;
  updated_at: string;
};

type Notes = {
  success: boolean;
  message: string;
  data: ListNotes;
};

export const getServerSideProps = (async (context) => {
  const { params } = context;
  const notes = await fetch(
    `https://service.pace-unv.cloud/api/notes/${params?.id || ''}`
  ).then((res) => res.json());

  return { props: { notes } };
}) satisfies GetServerSideProps<{
  notes: Notes;
}>;

export default function NotesServerPage({
  notes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div key={notes.data.id} className="p-4 bg-white rounded-lg shadow-sm">
      <h1>{notes.data.title}</h1>
      <p>{notes.data.description}</p>
    </div>
  );
}
