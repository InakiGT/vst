import { type UserEnrolled } from '@/app/lib/definitions'
import { acceptEnrolled, rateUser, rejectEnrolled } from '../lib/actions'

export default function UsersEnrolled({ users, itineraryId } : { users: UserEnrolled[] | undefined, itineraryId: string }) {


  return (
    <section className='relative h-60 bg-soft-black rounded-sm px-2 py-1 my-2'>
      <header className="bg-borders/80 rounded-2xl py-1 px-1 font-light mb-5 shadow-sm shadow-black absolute z-100 top-3 left-1 right-1">
          <ul className="grid grid-cols-4 gap-4 text-sm lg:text-lg">
            <li>Usuario</li>
            <li>Reputación</li>
            <li>Calificar</li>
            <li>Acciones</li>
          </ul>
      </header>
      <div className='h-full pt-12 overflow-scrol'>
      {
        users &&
        users.length > 0 ?
        users.map(u => (
          <ul key={ u.id } className="grid grid-cols-4 gap-4 text-sm items-center lg:text-lg border-b-borders border-b-1 pb-2">
            <li>{ u.name }</li>
            <li>{ u.average_rating ? u.average_rating : 'Aún sin calificar' }</li>
            <li>
              <select onChange={ async (e) => await rateUser(u.email, e.target.value, itineraryId) } name="" id="">
                <option>calificar</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </li>
            <li className='flex flex-col justify-start items-start gap-1'>
              {
                u.status === 'rechazada' ? (
                  <button onClick={ async () => await acceptEnrolled(itineraryId, u.email) } className="font-bold text-sm bg-main-blue rounded-sm py-1 px-2 cursor-pointer">Aceptar</button>
                ) : ( u.status === 'aceptada' ? (
                  <button onClick={ async () => await rejectEnrolled(itineraryId, u.email) }  className="font-bold text-sm bg-main-blue rounded-sm py-1 px-2 cursor-pointer">Rechazar</button>
                ) : (
                  <>
                    <button onClick={ async () => await acceptEnrolled(itineraryId, u.email) } className="font-bold text-sm bg-main-blue rounded-sm py-1 px-2 cursor-pointer">Aceptar</button>
                    <button onClick={ async () => await rejectEnrolled(itineraryId, u.email) }  className="font-bold text-sm bg-main-blue rounded-sm py-1 px-2 cursor-pointer">Rechazar</button>
                  </>
                ))
              }
            </li>
          </ul>
        )) : <span className="text-center">No hay usuarios inscritos</span>
      }
      </div>
    </section>
  )
}
