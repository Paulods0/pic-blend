"use client"
import Loader from "@/components/shared/Loader"
import { useUserContext } from "@/context/AuthContext"
import {
  useGetUserLikedPosts,
  useGetUserPosts,
} from "@/lib/react-query/queriesAndMutations"
import { HeartIcon, Image } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

const Profile = () => {
  const { user } = useUserContext()
  const [contentToShow, setContentToShow] = useState<"posts" | "likes">("posts")

  const { data: posts } = useGetUserPosts(user.id)

  const { data: likedPosts } = useGetUserLikedPosts(user.id)

  if (!posts || !likedPosts) return <Loader />

  // console.log(posts.length)

  const handleChangeContentToShow = (content: "posts" | "likes") => {
    setContentToShow(content)
  }

  return (
    <main className="h-screen  py-16 px-28">
      {/**Header */}
      <div className="w-full ">
        <div className="flex flex-col">
          {/**user infos*/}
          <div className="flex flex-col space-y-2">
            <div className=" flex w-full justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={user.imageUrl}
                  alt="user photo"
                  className="w-24 h-2w-24 rounded-full"
                />

                <div className="flex flex-col">
                  <div>
                    <p className="text-2xl lg:text-4xl font-semibold">
                      {user.name}
                    </p>
                    <p className="text-light-3">{user.email}</p>
                  </div>
                  <div className="flex space-x-3 mt-6 self-start">
                    <p className="font-semibold">
                      {" "}
                      <span className="text-pink-500 mr-[2px]">
                        {posts.length}
                      </span>{" "}
                      Posts
                    </p>
                    <p className="font-semibold">
                      <span className="text-pink-500 mr-[2px]">
                        {likedPosts.length}
                      </span>
                      Liked posts
                    </p>
                  </div>
                </div>
              </div>

              {/* <Link
                to={`/edit-profile/${user.id}`}
                className="flex items-center space-x-2 p-2 h-fit rounded-md text-white bg-dark-2 text-[12px]"
              >
                <FileEdit size={12} color="white" />
                <span>Edit Profile</span>
              </Link> */}
            </div>
          </div>
          {/**posts & likes */}
          <div className="flex  mt-10 lg:w-[280px] rounded-lg bg-white justify-center shadow-lg text-black transition-all">
            <button
              onClick={() => handleChangeContentToShow("posts")}
              className={`p-2  rounded-l-lg flex items-center space-x-2 flex-1 duration-300 ${
                contentToShow === "posts" ? "bg-pink-500" : "bg-transparent "
              }  `}
            >
              <Image size={18} color="black" />
              <p>Posts</p>
            </button>
            <button
              onClick={() => handleChangeContentToShow("likes")}
              className={`p-2 rounded-r-lg flex-1 space-x-2 flex items-center duration-300 bg-black  ${
                contentToShow === "likes" ? "bg-pink-500" : "bg-transparent"
              } `}
            >
              <HeartIcon size={20} color="black" />
              <p>Liked Posts</p>
            </button>
          </div>
        </div>
        <div></div>
      </div>

      {/**body */}

      {contentToShow === "posts" ? (
        <ul className="grid-container lg:grid lg:grid-cols-3 mt-12 transition-all">
          {posts.map((post) => (
            <li key={post.$id} className="relative min-w-40 h-40 duration-300">
              <Link to={`/posts/${post.$id}`} className="grid-post_link">
                <img
                  src={post?.imageUrl}
                  alt="post"
                  className="h-full w-full object-cover"
                />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid-container lg:grid lg:grid-cols-3 mt-12 transition-all">
          {likedPosts.map((post) => (
            <li key={post.$id} className="relative min-w-40 h-40 duration-300">
              <Link to={`/posts/${post.$id}`} className="grid-post_link">
                <img
                  src={post?.imageUrl}
                  alt="post"
                  className="h-full w-full object-cover"
                />
              </Link>
              <div className="absolute bottom-2 z-10 left-2 w-full flex items-center space-x-2">
                <img
                  src={post.creator.imageUrl}
                  className=" w-8 h-8 rounded-full"
                  alt=""
                />
                <p className="font-medium text-light-1">
                  {post.creator.name.split(" ")[0]}
                </p>
              </div>
              <div className="absolute bottom-0 w-full h-8 blur-md bg-black"></div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default Profile
