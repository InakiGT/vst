
export default function CredentialsFormContainer(
  { children }: { children: React.ReactNode }
) {
  return (
    <main className="bg-red-400 flex items-center h-screen justify-center bg-[url(https://i.pinimg.com/originals/66/48/8f/66488f1de5602e30bc0a01f26a985af6.gif)] bg-cover">
      { children }
    </main>
  )
}
