import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getInitials } from '@/shared/lib/initials'
import { logout } from '../api'
import { useMe } from '../hooks'
import { clearSession } from '../session'

export function UserMenu() {
  const me = useMe()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: logout,
    // Even if the request fails, this device should forget the session.
    onSettled: async () => {
      clearSession(queryClient)
      await navigate({ to: '/login' })
    },
  })

  if (!me) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full outline-none focus-visible:ring-2"
        aria-label="Open user menu"
      >
        <Avatar>
          <AvatarImage src={me.avatar_url ?? undefined} alt="" />
          <AvatarFallback>{getInitials(me.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{me.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => mutation.mutate()} disabled={mutation.isPending}>
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
