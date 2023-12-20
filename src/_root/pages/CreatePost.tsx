import { PlusCircle } from "lucide-react"
import PostForm from "@/components/forms/PostForm"

const CreatePost = () => {
  return (
    <div className="flex flex-1 ">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <button>
            <PlusCircle size={36} color="black" />
          </button>
          <h2 className="font-bold">Create Post</h2>
        </div>

        <PostForm action="Create" />
      </div>
    </div>
  )
}

export default CreatePost
