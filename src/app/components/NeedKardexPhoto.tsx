import Link from "next/link";
import Backward from "./Backward";

export default function NeedKardexPhoto() {
  return (
    <>
      <Backward title='Itinerarios / No puedes acceder' />

      <section className="bg-main-black rounded-sm h-10/12 shadow-lg shadow-black flex flex-col items-center justify-center px-30">
        <p className="text-2xl mb-10">No puedes tener acciones sobre itinerarios hasta que no agregues una foto de tu Kardex en la sección <span className="font-bold">Modificar perfil</span> para validar tu identidar</p>
        <Link className="bg-main-blue font-bold text-xl rounded-sm py-2 my-5 cursor-pointer px-6 mt-2" href='/itinerary/profile'>Ir a perfil</Link>
      </section>
    </>
  )
}
