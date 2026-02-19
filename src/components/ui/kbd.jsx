import { cn } from '@/lib/utils'

function Kbd({ className, ...props }) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'bg-muted font-mono text-muted-foreground in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 inline-flex h-5 max-h-full items-center border px-1 text-[0.625rem] font-medium rounded-md',
        "[&_svg:not([class*='size-'])]:size-3",
        'in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10',
        className,
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn('inline-flex items-center gap-1', className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
