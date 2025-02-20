import { useState, FormEvent } from "react";
import { useRouter } from 'next/router';
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

// Types
type Note = {
  id: string;
  title: string;
  description: string;
}

type ErrorType = {
  errors: {
    [key: string]: string;
  };
} | null;

type ServerNote = {
  success: boolean;
  message: string;
  data: {
    id: string;
    title: string;
    description: string;
    delete_at: string;
    created_at: string;
    updated_at: string;
  };
}

export const getServerSideProps = (async (context) => {
  const { params } = context;
  const response = await fetch(
    `https://service.pace-unv.cloud/api/notes/${params?.id || ''}`
  );
  const note = await response.json();
  return { props: { note } };
}) satisfies GetServerSideProps<{
  note: ServerNote;
}>;

export default function NoteServerEdit({
  note
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const [payload, setPayload] = useState<Note>({
    id: note.data.id,
    title: note.data.title,
    description: note.data.description,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorType>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/notes/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data);
        return;
      }

      router.push(`/notes/server/${payload.id}`);
    } catch (error) {
      console.error("An unexpected error happened:", error);
      setError({
        errors: {
          general: "An unexpected error occurred. Please try again."
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Edit Note</h2>
      {error?.errors?.general && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error.errors.general}
        </p>
      )}
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label 
            htmlFor="title" 
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={payload.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {error?.errors?.title && (
            <p className="mt-1 text-sm text-red-600">{error.errors.title}</p>
          )}
        </div>

        <div>
          <label 
            htmlFor="description" 
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={payload.description}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {error?.errors?.description && (
            <p className="mt-1 text-sm text-red-600">{error.errors.description}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Updating...' : 'Update Note'}
          </button>
        </div>
      </form>
    </div>
  );
}