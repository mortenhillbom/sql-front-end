import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools";

const QueryEditor = ({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (q: string) => void;
}) => {
  return (
    <AceEditor
      mode="sql"
      theme="tomorrow"
      highlightActiveLine
      style={{
        width: "100%",
        height: "100%",
      }}
      fontSize={16}
      name="graphql-schema-editor"
      editorProps={{ $blockScrolling: false }}
      value={query}
      onChange={setQuery}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: false,
        tabSize: 2,
      }}
    />
  );
};

export default QueryEditor;
