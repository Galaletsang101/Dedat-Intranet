import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import {
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaHeading,
  FaLink,
  FaQuoteRight,
  FaUndo,
  FaRedo,
} from "react-icons/fa";
import "../styles/richTextEditor.css";

/*
 * A plain-language rich text editor for Admin content forms - no raw
 * Markdown syntax is ever shown to the person typing. It stores/loads
 * standard Markdown under the hood (via tiptap-markdown) so the existing
 * `content_markdown` database columns and ReactMarkdown-based display
 * pages need no changes.
 */
function RichTextEditor({ value, onChange, placeholder, id, label, required }) {
  const isInternalUpdate = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({
        placeholder: placeholder || "Start typing...",
      }),
      Markdown.configure({
        html: false,
        transformPastedText: true,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor: currentEditor }) => {
      isInternalUpdate.current = true;
      onChange(currentEditor.storage.markdown.getMarkdown());
    },
    editorProps: {
      attributes: {
        class: "rich-text-content",
        id: id,
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": label || placeholder || "Rich text content",
      },
    },
  });

  // Keep the editor in sync if `value` changes from outside (e.g. form reset)
  // without fighting the user's own typing.
  useEffect(() => {
    if (!editor) return;

    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const currentMarkdown = editor.storage.markdown.getMarkdown();

    if ((value || "") !== currentMarkdown) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return <div className="rich-text-editor rich-text-loading" />;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter a URL", previousUrl || "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="rich-text-editor">
      <div className="rich-text-toolbar" role="toolbar" aria-label="Text formatting">
        <button
          type="button"
          aria-label="Bold"
          aria-pressed={editor.isActive("bold")}
          className={editor.isActive("bold") ? "active" : ""}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FaBold />
        </button>

        <button
          type="button"
          aria-label="Italic"
          aria-pressed={editor.isActive("italic")}
          className={editor.isActive("italic") ? "active" : ""}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FaItalic />
        </button>

        <button
          type="button"
          aria-label="Heading"
          aria-pressed={editor.isActive("heading", { level: 2 })}
          className={editor.isActive("heading", { level: 2 }) ? "active" : ""}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <FaHeading />
        </button>

        <button
          type="button"
          aria-label="Bullet list"
          aria-pressed={editor.isActive("bulletList")}
          className={editor.isActive("bulletList") ? "active" : ""}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FaListUl />
        </button>

        <button
          type="button"
          aria-label="Numbered list"
          aria-pressed={editor.isActive("orderedList")}
          className={editor.isActive("orderedList") ? "active" : ""}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FaListOl />
        </button>

        <button
          type="button"
          aria-label="Quote"
          aria-pressed={editor.isActive("blockquote")}
          className={editor.isActive("blockquote") ? "active" : ""}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <FaQuoteRight />
        </button>

        <button type="button" aria-label="Insert link" onClick={setLink}>
          <FaLink />
        </button>

        <span className="toolbar-divider" aria-hidden="true" />

        <button
          type="button"
          aria-label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <FaUndo />
        </button>

        <button
          type="button"
          aria-label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <FaRedo />
        </button>
      </div>

      <EditorContent editor={editor} />
      {required && (
        <span className="sr-only">This field is required.</span>
      )}
    </div>
  );
}

export default RichTextEditor;
