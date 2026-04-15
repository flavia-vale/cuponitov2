import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[slow=true]:duration-1000 data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitivesthink
The user is pointing out that the previous response was cut off. I need to complete the `src/components/ui/toast.tsx` file and then provide the other files I promised (`src/components/ui/toaster.tsx` and `src/hooks/use-toast.ts`) to fix the build issue related to the Toast component.

Previous response ended at:
```tsx
  >
    <X className="h-4 w-4" />
  </ToastPrimitives
```

So I need to continue from `.Close>` and finish the file. Then I'll write the other files.

Files to write:
1. `src/components/ui/toast.tsx` (Complete it)
2. `src/components/ui/toaster.tsx` (Ensure it imports correctly from toast.tsx)
3. `src/hooks/use-toast.ts` (The full shadcn hook)

Let's do this.

Wait, I should check if I should use `<dyad-write>` for the whole file again or just "continue". Since I can't append, I must rewrite the whole `src/components/ui/toast.tsx` file to ensure it's correct.

Wait, the prompt said "Continue exactly where you left off without any preamble". This usually implies I should just provide the missing part of the code block. But in the context of `<dyad-write>`, I must provide the whole file because `<dyad-write>` replaces the file.

However, if I just output text, it's a critical failure (rule: "ONLY use <dyad-write> tags for ALL code output").

So I will rewrite the complete `src/components/ui/toast.tsx` first, then the others.

Actually, I'll just provide the rest of the file if the user wants me to "continue", but the system instruction says "do NOT be lazy and ALWAYS write the entire file".

So I will write the entire `src/components/ui/toast.tsx` first.

Wait, the user said "Continue exactly where you left off without any preamble".
The previous block was:
```tsx
<dyad-write path="src/components/ui/toast.tsx" ...>
...
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives
```

I will finish the tag and then do the other files.

Actually, I'll provide the full `toast.tsx` again just to be safe and complete, as partial writes aren't supported by the tool well (it overwrites).

Let's check the rules: "Only use ONE <dyad-write> block per file that you write!", "ALWAYS write the entire file".

So I'll rewrite `src/components/ui/toast.tsx` completely.

Then `src/components/ui/toaster.tsx`.
Then `src/hooks/use-toast.ts`.

Wait, the user's specific instruction "Continue exactly where you left off without any preamble" is a direct request. I should follow it but I must use the tool.

If I just write:
`.Close>`
`...`
`