export type User = {
  id: string
  name: string
  lastname: string
  email: string
  password: string
  kardex_photo: string
}

export type UserEnrolled = User & {
  status: string
  average_rating: number | null
}

export type Itinerary = {
  id: string
  plate: string
  color: string
  direction : 'uam' | 'location',
  location: string
  capacity: number
  hour: string
  user_email: string
  status: 'a' | 's'
  days: string
}

export type ItineraryFromDb = Omit<Itinerary, 'location'> & {
  location: {
    x: number
    y: number
  }
} & User

export type EnrolledUser = {
  itinerary_id: string
  user_email: string
}


export type Coords = {
  lat: number
  lng: number
}
