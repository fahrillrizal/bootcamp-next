import { useState, FormEvent } from "react";
import { useRouter } from 'next/router';

export default function NoteServerCreate() {
  const router = useRouter();
  const [payload, setPayload] = useState<{
    title: string;
    description: string;
  }>({
    title: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<{
    errors: { [key: string]: string };
  } | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/notes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const data = await response.json()
        setError(data);
        return;
      }

      const data = await response.json()
      if (data.success) {
        router.push("/notes/server")
      }
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

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Create Note</h2>
      {error?.errors?.general && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error.errors.general}
        </p>
      )}
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={payload.title}
            onChange={(e) => setPayload({ ...payload, title: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {error && typeof error === 'object' && error.errors && (
            <small className="text-red-600">{error.errors.title}</small>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={payload.description}
            onChange={(e) => setPayload({ ...payload, description: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {error && typeof error === 'object' && error.errors && (
            <p className="mt-1 text-sm text-red-600">{error.errors.description}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Creating...' : 'Create Note'}
        </button>
      </form>
    </div>
  );
}