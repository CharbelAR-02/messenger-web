import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/shared/lib/initials'

interface UserAvatarProps {
  name: string
  url?: string | null
  className?: string
}

export function UserAvatar({ name, url, className }: UserAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={url ?? undefined} alt="" />
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  )
}
