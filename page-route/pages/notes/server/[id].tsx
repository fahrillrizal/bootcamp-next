import {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from 'next/router';

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
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/notes/server/edit/${notes.data.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{notes.data.title}</h1>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Edit Note
          </button>
        </div>
        <p className="text-gray-600 whitespace-pre-wrap">{notes.data.description}</p>
        <div className="mt-4 text-sm text-gray-500">
          <p>Created: {new Date(notes.data.created_at).toLocaleDateString()}</p>
          <p>Last Updated: {new Date(notes.data.updated_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}