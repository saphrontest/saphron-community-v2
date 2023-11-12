
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
        }
    }}
      onChange={ ( _event, editor ) => {
          const data = editor.getData();
          onChange("body", data)
      } }
      onBlur={ ( event, editor ) => {
          console.log( 'Blur.', editor );
      } }
      onFocus={ ( event, editor ) => {
          console.log( 'Focus.', editor );
      } }
      
    />
  )
}

export default TextEditor