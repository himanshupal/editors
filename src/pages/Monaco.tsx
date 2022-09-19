import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { useState, useEffect, useRef } from "react";
import { getCode } from "@/utils/getLogs";
import { SolidityId } from "@/workers";

const Editor = () => {
  const created = useRef<boolean>(false);
  const mountElement = useRef<HTMLDivElement | null>(null);
  const [_editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(null);

  const defaultConfigOptions: editor.IStandaloneEditorConstructionOptions = {
    smoothScrolling: true,
    automaticLayout: true,
    value: getCode(),
    theme: SolidityId,
    language: SolidityId,
    fastScrollSensitivity: 7,
    minimap: {
      enabled: false,
    },
    scrollbar: {
      verticalScrollbarSize: 5,
      horizontalScrollbarSize: 7.5,
    },
  };

  useEffect(() => {
    if (!mountElement.current) return;

    const _editor = editor.create(mountElement.current, defaultConfigOptions);

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
