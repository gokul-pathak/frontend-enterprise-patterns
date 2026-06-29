'use client';

import MuiAvatar, { AvatarProps as MuiAvatarProps } from '@mui/material/Avatar';
import { Tooltip } from '@mui/material';

interface AvatarProps extends Omit<MuiAvatarProps, 'src'> {
  name: string;
  src?: string | null;
  size?: number;
  showTooltip?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 55%, 45%)`;
}

/**
 * User avatar with deterministic fallback color based on name.
 * Using a color derived from the name means the same user always gets the same
 * color — which feels natural and avoids jarring color changes on rerenders.
 */
export function Avatar({ name, src, size = 36, showTooltip = false, sx, ...props }: AvatarProps) {
  const avatar = (
    <MuiAvatar
      src={src ?? undefined}
      alt={name}
      sx={{
        width: size,
        height: size,
        bgcolor: src ? undefined : stringToColor(name),
        fontSize: size * 0.38,
        fontWeight: 600,
        ...sx,
      }}
      {...props}
    >
      {!src && getInitials(name)}
    </MuiAvatar>
  );

  if (showTooltip) {
    return <Tooltip title={name}>{avatar}</Tooltip>;
  }

  return avatar;
}
