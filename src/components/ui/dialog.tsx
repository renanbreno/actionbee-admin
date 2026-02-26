"use client"

import * as React from "react"
import { XIcon, Loader2 } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 hover:cursor-pointer focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

interface DialogActionsProps {
  /**
   * Whether to show a loading state (disables both buttons)
   */
  isLoading?: boolean
  /**
   * Loading text for the submit button
   * @default "Salvando..."
   */
  loadingText?: string
  /**
   * Label for the cancel button
   * @default "Cancelar"
   */
  cancelLabel?: string
  /**
   * Label for the submit button
   * @default "Salvar"
   */
  submitLabel?: string
  /**
   * Click handler for the cancel button
   */
  onCancel: () => void
  /**
   * Form submit handler (optional - only needed when used without parent form)
   */
  onSubmit?: (e: React.FormEvent) => void
  /**
   * Button type for the submit button
   * @default "submit"
   */
  submitButtonType?: "button" | "submit"
  /**
   * Additional props to pass to the submit button
   */
  submitButtonProps?: Omit<React.ComponentProps<typeof Button>, "type" | "children" | "disabled">
  /**
   * Whether to show a border separator
   * @default true
   */
  withBorder?: boolean
  /**
   * Custom footer content to render alongside actions
   */
  children?: React.ReactNode
}

/**
 * Standardized dialog actions component with consistent styling and behavior.
 *
 * Provides a cancel button (outline variant) and a submit button with:
 * - Mobile-first layout (stacked on mobile, row on desktop)
 * - Loading state support
 * - Disabled state handling
 *
 * @example
 * ```tsx
 * // Use inside existing form
 * <form onSubmit={handleSubmit(onSubmit)}>
 *   <DialogActions
 *     isLoading={isPending}
 *     submitLabel="Salvar"
 *     onCancel={() => setOpen(false)}
 *   />
 * </form>
 *
 * // Use with custom submit handler
 * <DialogActions
 *   isLoading={isPending}
 *   submitLabel="Salvar"
 *   onCancel={() => setOpen(false)}
 *   onSubmit={handleSubmit(onSubmit)}
 *   submitButtonType="button"
 * />
 * ```
 */
function DialogActions({
  isLoading = false,
  loadingText = "Salvando...",
  cancelLabel = "Cancelar",
  submitLabel = "Salvar",
  onCancel,
  onSubmit,
  submitButtonType = "submit",
  submitButtonProps = {},
  withBorder = true,
  children,
}: DialogActionsProps) {
  const content = (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="w-full sm:w-auto hover:bg-muted hover:text-foreground hover:border-muted-foreground/20"
      >
        {cancelLabel}
      </Button>
      <Button
        type={submitButtonType}
        onClick={submitButtonType === "button" ? onSubmit : undefined}
        disabled={isLoading}
        className="w-full sm:w-auto min-w-[120px]"
        {...submitButtonProps}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {isLoading ? loadingText : submitLabel}
      </Button>
      {children}
    </>
  )

  const footerClass = cn(
    "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
    withBorder && "border-t pt-4"
  )

  return <div className={footerClass}>{content}</div>
}

export {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
