import Editor from '@monaco-editor/react'

export default function JsonTree({ jsonData, handleEditorChange }) {
  return (
    <div style={{ height: 400, border: '1px solid #eee', borderRadius: 4 }}>
      <Editor
        height="100%"
        defaultLanguage="json"
        value={jsonData}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          formatOnPaste: true,
          formatOnType: true,
        }}
        theme="vs-light"
      />
    </div>
  )
}
