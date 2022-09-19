import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { defaultMonacoConfig } from "@/config/monaco";
import { useState, useEffect, useRef } from "react";

const Editor = () => {
  const created = useRef<boolean>(false);
  const mountElement = useRef<HTMLDivElement | null>(null);
  const [_editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!mountElement.current) return;

    const _editor = editor.create(mountElement.current, defaultMonacoConfig);

    if (!created.current) {
      setEditor(_editor);
      created.current = true;
    }

    function callback() {
      _editor.dispose();
    }

    return callback;
  }, [mountElement.current]);

  useEffect(() => {
    if (!_editor) return;
    console.debug({ _editor });
  }, [_editor]);

  return <div className="full-page" ref={mountElement} />;
};

export default Editor;
