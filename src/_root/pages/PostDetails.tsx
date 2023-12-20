// import React from "react"
import { useGetPostById } from "@/lib/react-query/queriesAndMutations"
import { multiFormatDateString } from "@/lib/utils"
import { Link, useParams } from "react-router-dom"
import { useUserContext } from "@/context/AuthContext"

import Loader from "@/components/shared/Loader"
import { EditIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import PostStats from "@/components/shared/PostStats"

const PostDetails = () => {
  const { id } = useParams()
  const { data: post, isPending } = useGetPostById(id || "")
  const { user } = useUserContext()

  const handleDeletePost = () => {}

  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img
            src={post?.imageUrl}
            alt="creator"
            className="post_details-img"
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    post?.creator?.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:h-12 lg:w-12"
                />

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-dark-2">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    -
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}
                >
                  <EditIcon color="grey" size={24} />
                </Link>

                <Button
                  variant="ghost"
                  onClick={handleDeletePost}
                  className={` ${user.id !== post?.creator.$id && "hidden"}`}
                >
                  <TrashIcon color="red" size={24} />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-light-2" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <div>
                <p>{post?.caption}</p>
              </div>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default PostDetails
