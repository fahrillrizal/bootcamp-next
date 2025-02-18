import { GetServerSideProps, InferGetStaticPropsType } from "next";

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

export const getStaticPaths = async () => {
  const notes = await fetch(`https://service.pace-unv.cloud/api/notes`).then(
    (res) => res.json()
  );
  const paths = notes.data.map(( note: ListNotes) => ({ params: { id: note.id } }))
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = (async (context) => {
  const { params } = context;
  const notes = await fetch(
    `https://service.pace-unv.cloud/api/notes/${params?.id || ""}`
  ).then((res) => res.json());

  return { props: { notes }, revalidate: 3 };
}) satisfies GetServerSideProps<{
  notes: Notes;
}>;

export default function NotesSSGPage({
  notes,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div key={notes.data.id} className="p-4 bg-white rounded-lg shadow-sm">
      <h1>{notes.data.title}</h1>
      <p>{notes.data.description}</p>
    </div>
  );
}
