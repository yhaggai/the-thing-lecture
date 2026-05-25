import React from 'react'

export function Flex({ css, style, ...props }: any) {
  return <div style={{ ...css, ...style }} {...props} />
}

export function Span({ css, style, ...props }: any) {
  return <span style={{ ...css, ...style }} {...props} />
}
