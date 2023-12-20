import { Models } from "appwrite"
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"

import { checkIsLiked } from "@/lib/utils"
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetCurrentUser,
} from "@/lib/react-query/queriesAndMutations"
import { BookmarkIcon, HeartIcon } from "lucide-react"
import Loader from "./Loader"

type PostStatsProps = {
  post?: Models.Document
  userId: string
  changeNumberColor?: boolean
}

const PostStats = ({
  post,
  userId,
  changeNumberColor = false,
}: PostStatsProps) => {
  const location = useLocation()
  const likesList = post?.likes.map((user: Models.Document) => user.$id)

  const [likes, setLikes] = useState<string[]>(likesList)
  const [isSaved, setIsSaved] = useState(false)

  const { mutate: likePost } = useLikePost()
  const { mutate: savePost, isPending: isSavingPost } = useSavePost()
  const { mutate: deleteSavePost, isPending: isDeletingPost } =
    useDeleteSavedPost()

  const { data: currentUser } = useGetCurrentUser()

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post?.$id
  )

  useEffect(() => {
    setIsSaved(!!savedPostRecord)
  }, [currentUser])

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation()

    let likesArray = [...likes]

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId)
    } else {
      likesArray.push(userId)
    }

    setLikes(likesArray)
    likePost({ postId: post?.$id || "", likesArray })
  }

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (savedPostRecord) {
      setIsSaved(false)
      return deleteSavePost(savedPostRecord.$id)
    }

    savePost({ postId: post?.$id || "", userId: userId })
    setIsSaved(true)
  }

  return (
    <div className="flex justify-between items-center z-20 ">
      <div className="flex gap-2 mr-5">
        <HeartIcon
          onClick={handleLikePost}
          size={20}
          color="red"
          fill={checkIsLiked(likes, userId) ? "red" : "transparent"}
          className="cursor-pointer"
        />

        <p
          className={`small-medium ${
            changeNumberColor ? "text-light-1" : "text-dark-2"
          } lg:base-medium`}
        >
          {likes.length}
        </p>
      </div>

      <div className="flex gap-2">
        {isSavingPost || isDeletingPost ? (
          <Loader />
        ) : (
          <BookmarkIcon
            size={20}
            color="purple"
            fill={isSaved ? "purple" : "transparent"}
            className="cursor-pointer"
            onClick={handleSavePost}
          />
        )}
      </div>
    </div>
  )
}

export default PostStats
