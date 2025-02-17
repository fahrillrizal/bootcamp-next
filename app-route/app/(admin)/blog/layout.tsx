export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <p>Blog Layout</p>
      {children}
    </div>
  );
}