
// // Stays in check with db before giving user

// "use client"

// import { useEffect, useState } from "react"
// import { createClient } from "@/lib/supabase/client"
// import type { User } from "@supabase/supabase-js"

// export function useUser() {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const supabase = createClient()

//     supabase.auth.getUser().then(({ data }) => {
//       setUser(data.user)
//       setLoading(false)
//     })

//     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user ?? null)
//     })

//     return () => listener.subscription.unsubscribe()
//   }, [])

//   return { user, loading, isLoggedIn: !!user }
// }



// Less secure used for showing name ect.
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export function getUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading, isLoggedIn: !!user }
}