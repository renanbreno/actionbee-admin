"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Minus,
  RemoveFormatting,
} from "lucide-react";
import { Button } from "./button";
import { Separator } from "./separator";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

const toolbarButtonClass =
  "h-8 w-8 p-0 hover:bg-muted data-[state=active]:bg-muted data-[state=active]:text-accent-foreground transition-colors";

interface ToolbarButtonProps {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
  disabled?: boolean;
}

const ToolbarButton = ({
  active,
  onClick,
  children,
  title,
  disabled = false,
}: ToolbarButtonProps) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    className={toolbarButtonClass}
    data-state={active ? "active" : "inactive"}
    onClick={onClick}
    disabled={disabled}
    title={title}
  >
    {children}
  </Button>
);

const ToolbarSeparator = () => <Separator orientation="vertical" className="h-6 mx-1" />;

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Digite seu conteúdo...",
  className,
  label,
  error,
  disabled = false,
}: RichTextEditorProps) {
  const isUpdating = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      if (isUpdating.current) return;
      // Store as JSON string
      const json = editor.getJSON();
      onChange(JSON.stringify(json));
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none min-h-[150px] px-3 py-2",
          "sm:prose sm:min-h-[180px]",
        ),
      },
    },
    editable: !disabled,
  });

  // Sync external value to editor
  useEffect(() => {
    if (!editor) return;

    const currentJson = JSON.stringify(editor.getJSON());

    if (value !== currentJson) {
      isUpdating.current = true;

      if (value && value.trim() !== "") {
        try {
          const parsed = JSON.parse(value);
          editor.commands.setContent(parsed);
        } catch {
          // If value is not valid JSON, set as text
          editor.commands.setContent(value);
        }
      } else {
        editor.commands.clearContent();
      }

      // Reset flag after a small delay to avoid triggering onUpdate
      setTimeout(() => {
        isUpdating.current = false;
      }, 0);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}

      <div
        className={cn(
          "rounded-md border border-input bg-background ring-offset-background",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          error && "border-destructive",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
          {/* Undo/Redo */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Desfazer (Ctrl+Z)"
            disabled={disabled}
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Refazer (Ctrl+Shift+Z)"
            disabled={disabled}
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Text Formatting */}
          <ToolbarButton
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Negrito (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Itálico (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Sublinhado (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Tachado"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Headings */}
          <ToolbarButton
            active={editor.isActive("heading", { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            title="Título 1"
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Título 2"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("heading", { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            title="Título 3"
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Lists */}
          <ToolbarButton
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Lista com marcadores"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Lista numerada"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Blockquote */}
          <ToolbarButton
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Citação"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Horizontal Rule */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Linha horizontal"
          >
            <Minus className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Clear Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            title="Limpar formatação"
          >
            <RemoveFormatting className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Editor Content */}
        <div className="cursor-text">
          <EditorContent editor={editor} />
        </div>
      </div>

      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}
    </div>
  );
}

// Component for displaying rich text content (read-only)
interface RichTextDisplayProps {
  content: string; // JSON string
  className?: string;
}

export function RichTextDisplay({ content, className }: RichTextDisplayProps) {
  let parsedContent = content;

  // Try to parse as JSON, fallback to plain text
  try {
    parsedContent = JSON.parse(content);
  } catch {
    // Content is plain text or HTML, use as-is
  }

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Underline],
    content: parsedContent,
    editable: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none",
          "sm:prose-base",
          "prose-headings:font-semibold prose-headings:text-foreground",
          "prose-p:text-muted-foreground",
          "prose-strong:text-foreground prose-strong:font-semibold",
          "prose-em:text-muted-foreground",
          "prose-ul:list-disc prose-ol:list-decimal",
          "prose-li:marker:text-muted-foreground",
          "prose-blockquote:border-l-2 prose-blockquote:border-muted-foreground/30 prose-blockquote:pl-4 prose-blockquote:italic",
          "prose-hr:border-muted-foreground/20",
          className,
        ),
      },
    },
  });

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
