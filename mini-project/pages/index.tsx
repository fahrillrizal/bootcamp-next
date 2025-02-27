import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import useSWR from 'swr'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().min(1, 'URL is required').url('Invalid URL format'),
})

type Link = {
  id: number
  title: string
  url: string
  created_at?: Date | null
  updated_at?: Date | null
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
  const { data: dataLinks, isLoading, mutate } = useSWR('/api/links', fetcher)

  const [loading, setLoading] = useState<boolean>(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [editData, setEditData] = useState<Link | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  // Form untuk Create
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      url: '',
    },
  })

  // Form untuk Edit
  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editData || { title: '', url: '' },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
      await fetch('/api/links/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      mutate()
      form.reset()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (deleteId) {
      await fetch('/api/links/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteId }),
      })
      mutate()
      setDeleteModalOpen(false)
    }
  }

  const handleEditClick = (link: Link) => {
    setEditData(link)
    editForm.reset(link)
    setEditModalOpen(true)
  }

  const handleEditSave = async (values: z.infer<typeof formSchema>) => {
    if (editData) {
      await fetch('/api/links/edit', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editData.id, ...values }),
      })
      setEditModalOpen(false)
      mutate()
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* FORM CREATE */}
      <Card>
        <CardHeader>
          <CardTitle>Form Create Link</CardTitle>
          <CardDescription>Submit your link here</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="title ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Url</FormLabel>
                    <FormControl>
                      <Input placeholder="url ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Loading ...' : 'Submit'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <p>Loading ...</p>}

      {dataLinks?.data?.map((link: Link) => (
        <Card key={link.id}>
          <CardContent className="flex justify-between">
            <a href={link.url} target="_blank">
              {link.title}
            </a>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleEditClick(link)}>
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setDeleteId(link.id)
                  setDeleteModalOpen(true)
                }}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Modal Edit */}
      {editModalOpen && editData && (
        <Drawer open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Edit Link</DrawerTitle>
            </DrawerHeader>
            <CardContent>
              <Form {...editForm}>
                <form
                  onSubmit={editForm.handleSubmit(handleEditSave)}
                  className="space-y-4"
                >
                  <FormField
                    control={editForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Url</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DrawerFooter className="flex flex-row justify-end items-center gap-2">
  <Button type="submit" className="w-32">
    Save
  </Button>
  <DrawerClose asChild>
    <Button variant="outline" className="w-32">
      Cancel
    </Button>
  </DrawerClose>
</DrawerFooter>

                </form>
              </Form>
            </CardContent>
          </DrawerContent>
        </Drawer>
      )}

      {/* Modal Delete */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this link?</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
