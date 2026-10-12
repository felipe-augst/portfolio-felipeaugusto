import type { ComponentProps, ReactNode } from 'react'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { isExternalUrl, opensInNewTab } from '@/lib/links'
import { Icon } from '@/components/ui/Icon'

type ButtonVariant = 'primary' | 'outline' | 'ghost'

type BaseProps = {
  variant?: ButtonVariant
  leadingIcon?: LucideIcon
  trailingIcon?: LucideIcon
  className?: string
  children: ReactNode
}

// Com `href`, o Button é um link.
type LinkButtonProps = BaseProps & {
  href: string
  download?: boolean | string
}

// Sem `href`, é um <button> nativo, para ações na própria página.
type NativeButtonProps = BaseProps &
  Omit<ComponentProps<'button'>, keyof BaseProps> & {
    href?: never
  }

export type ButtonProps = LinkButtonProps | NativeButtonProps

/** Foco visível compartilhado por todo elemento interativo do site. */
export const focusRing =
  'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2'

const baseStyles = cn(
  'inline-flex items-center',
  'text-xs uppercase tracking-[0.2em]',
  'transition-colors duration-300',
  focusRing,
)

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    'gap-3 px-7 py-4',
    'border border-sand text-sand font-medium',
    'hover:bg-sand hover:text-bg',
  ),
  // Contorno discreto, para os controles do cabeçalho e do menu (Menu e Fechar).
  outline: cn(
    'gap-3 px-5 py-2.5',
    'border border-border-strong text-sand font-medium',
    'hover:bg-sand hover:text-bg',
  ),
  ghost: cn('gap-2', 'text-sand-muted', 'hover:text-accent'),
}

function isStaticAsset(href: string): boolean {
  return /\.(pdf|zip|doc|docx|xls|xlsx|png|jpg|jpeg|webp|svg)$/i.test(href)
}

function isLinkProps(props: ButtonProps): props is LinkButtonProps {
  return props.href !== undefined
}

function buttonClasses(variant: ButtonVariant = 'primary', className?: string) {
  return cn(baseStyles, variantStyles[variant], className)
}

function ButtonContent({
  leadingIcon,
  trailingIcon,
  children,
}: Pick<BaseProps, 'leadingIcon' | 'trailingIcon' | 'children'>) {
  return (
    <>
      {leadingIcon && <Icon icon={leadingIcon} className="size-4" />}
      <span>{children}</span>
      {trailingIcon && <Icon icon={trailingIcon} className="size-4" />}
    </>
  )
}

function LinkButton({
  href,
  variant,
  leadingIcon,
  trailingIcon,
  download,
  className,
  children,
}: LinkButtonProps) {
  const isExternal = isExternalUrl(href)
  const newTab = isExternal && opensInNewTab(href)
  const useNativeAnchor = isExternal || isStaticAsset(href)
  const classes = buttonClasses(variant, className)
  const content = (
    <ButtonContent leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
      {children}
    </ButtonContent>
  )

  if (useNativeAnchor) {
    return (
      <a
        href={href}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        download={download}
        className={classes}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classes} download={download}>
      {content}
    </Link>
  )
}

function NativeButton({
  variant,
  leadingIcon,
  trailingIcon,
  className,
  children,
  type = 'button',
  ...buttonProps
}: NativeButtonProps) {
  return (
    <button type={type} {...buttonProps} className={buttonClasses(variant, className)}>
      <ButtonContent leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
        {children}
      </ButtonContent>
    </button>
  )
}

export function Button(props: ButtonProps) {
  return isLinkProps(props) ? <LinkButton {...props} /> : <NativeButton {...props} />
}
