import { useState } from "react";
import { marked } from "marked";

const initialMarkdown = `# Welcome to my Markdown Previewer!

## This is a sub-heading...

[This is a link](https://www.freecodecamp.org)

Inline code: \`<div></div>\`

\`\`\`
// Code block
function greet(name) {
  return \`Hello, \${name}\`;
}
\`\`\`

- List item 1
- List item 2
- List item 3

> This is a blockquote

**This is bold text**

![React Logo](https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg)
`;

function App() {

  const [markdown, setMarkdown] = useState(initialMarkdown);
  return (
    <div className="container">

      <section className="editor-container">
        <div className="header" id="editor-header">
          <i className="fa fa-free-code-camp fcc-icon" title="no-stack-dub-stack"></i>
          Editor
          <i class="fa fa-times cross-icon"></i>
        </div>
        <textarea id="editor" value={markdown} onChange={(event) => setMarkdown(event.target.value)}></textarea>
      </section>

      <section className="previewer-container">
        <h3 className="title">Previewer</h3>
        <div id="previewer" dangerouslySetInnerHTML={{ __html: marked(markdown) }}>
        </div>
      </section>
    </div>
  )
}

export default App;