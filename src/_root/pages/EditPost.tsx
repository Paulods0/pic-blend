import React from "react"
import { PlusCircle } from "lucide-react"
import PostForm from "@/components/forms/PostForm"
import { useParams } from "react-router-dom"
import { useGetPostById } from "@/lib/react-query/queriesAndMutations"
import Loader from "@/components/shared/Loader"

const EditPost = () => {
  const { id } = useParams()
  const { data: post, isPending } = useGetPostById(id || "")

  if (isPending) return <Loader />

  return (
    <div className="flex flex-1 ">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <button>
            <PlusCircle size={36} color="white" />
          </button>
          <h2>Edit Post</h2>
        </div>

        <PostForm action="Update" post={post} />
      </div>
    </div>
  )
}

export default EditPost
