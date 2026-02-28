import React from "react"
import Svg, { Path } from "react-native-svg"

type Props = {
  size?: number
  color?: string
}

/**
 * Acrobatics icon from SVG Repo.
 * Matches lucide's icon API surface so it can be used interchangeably.
 */
export function AcrobaticsIcon({ size = 24, color = "currentColor" }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 30 30" fill={color}>
      <Path d="M25.003906 2.9941406 A 1.0001 1.0001 0 0 0 24.552734 3.1054688L14.763672 8L4 8 A 1.0001 1.0001 0 1 0 4 10L4.0839844 10L12 11L12 16.634766L12 20.992188L12 26 A 1.0001 1.0001 0 1 0 14 26L14.591797 19.505859C14.617797 19.219859 14.702797 18.942406 14.841797 18.691406L16.011719 16.572266C16.352719 15.954266 16.9835 15.552906 17.6875 15.503906L24.933594 15L25 15 A 1.0001 1.0001 0 1 0 25 13L17 13L17 10.957031L25.535156 4.8457031 A 1.0001 1.0001 0 0 0 25.003906 2.9941406 z M 18.5 17 A 2.5 2.5 0 0 0 16 19.5 A 2.5 2.5 0 0 0 18.5 22 A 2.5 2.5 0 0 0 21 19.5 A 2.5 2.5 0 0 0 18.5 17 z" />
    </Svg>
  )
}
