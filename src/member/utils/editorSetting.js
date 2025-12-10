

import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Highlight from "@tiptap/extension-highlight"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import TextAlign from "@tiptap/extension-text-align"
import Typography from "@tiptap/extension-typography"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Blockquote from "@tiptap/extension-blockquote"
import CodeBlock from "@tiptap/extension-code-block"


export const CustomHighlight = Highlight.extend({
    addAttributes() {
        return {
            color: {
                default: null,
                parseHTML: element => element.getAttribute("data-color"),
                renderHTML: attributes => {
                    if (!attributes.color) return {};
                    return {
                        "data-color": attributes.color,
                        style: `background-color: ${attributes.color};`
                    };
                }
            }
        };
    }
});


export const editorExtensions = [
    StarterKit.configure({
        codeBlock: false,
        blockquote: false,
    }),

    CodeBlock,
    Blockquote,

    TaskList,
    TaskItem.configure({
        nested: true,
    }),

    Image.configure({
        inline: false,
        allowBase64: true,
    }),

    CustomHighlight,
    Subscript,
    Superscript,
    Typography,

    TextAlign.configure({
        types: ["heading", "paragraph"],
    }),
];
