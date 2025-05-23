import Backward from '@/app/components/Backward'
import { fetchUserByEmail } from '@/app/lib/data'
import { auth } from '@/auth'
import { notFound } from 'next/navigation'
import UploadImgForm from '@/app/components/UploadImgForm'
import UpdateUserForm from '@/app/components/UpdateUserForm'

export default async function Page() {
  const session = await auth()
  const user = await fetchUserByEmail(session?.user?.email ?? '')

  if ( !user ) notFound()

  return (
    <>
      <Backward title="Perfil / Editar perfil" />
      <section className="bg-main-black rounded-sm h-10/12 shadow-lg shadow-black px-50 py-20 overflow-y-scroll">
        <UpdateUserForm user={ user } />
        <UploadImgForm kardexImg={ user.kardex_photo } />
      </section>
    </>
  )
}
