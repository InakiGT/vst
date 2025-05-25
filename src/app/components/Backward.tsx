import Link from "next/link";

export default function Backward({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-1">
    <span className="transition-transform translate-x-1 hover:translate-x-0"><Link href="/itinerary">
      <svg className="w-8 h-8 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14 8-4 4 4 4"/>
      </svg>
    </Link></span>
    <h1 className="text-3xl font-bold">{ title }</h1>
  </div>
  )
}
