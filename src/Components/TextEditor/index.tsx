
import { FC } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface TextEditorProps {
  onChange: ( name: string, data: string ) => void;
  value: string;
}


const TextEditor: FC<TextEditorProps> = ({onChange, value}) => {
  return (
    <CKEditor
      editor={ ClassicEditor }
      data={value}
      config={{
        toolbar: {
          items: [
            'undo', 'redo',
            '|', 'heading',
            '|', 'bold', 'italic',
            '|', 'link', 'blockQuote',
            '|', 'bulletedList', 'numberedList'
          ]
        },
        link: { addTargetToExternalLinks: true }
    }}
      onChange={ ( _event, editor ) => {
          const data = editor.getData();
          onChange("body", data)
      } }
      
    />
  )
}

export default TextEditor