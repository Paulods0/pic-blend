import  { useCallback, useState } from "react"
import { useDropzone, FileWithPath } from "react-dropzone"
import { FilesIcon } from "lucide-react"
import { Button } from "../ui/button"
import { convertFileToUrl } from "@/lib/utils"

type FileUploaderType = {
  fieldChange: (files: File[]) => void
  mediaUrl: string
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderType) => {
  const [file, setFile] = useState<File[]>([])
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl)

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles)
      fieldChange(acceptedFiles)
      setFileUrl(convertFileToUrl(acceptedFiles[0]))
    },
    [file]
  )
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".svg"],
    },
  })

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-light-2 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img src={fileUrl} alt="image" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box">
          <FilesIcon size={96} color="gray" />
          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag Photo Here
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG,PNG,JPG</p>
          <Button className="bg-pink-500">Select from computer</Button>
        </div>
      )}
    </div>
  )
}

export default FileUploader
