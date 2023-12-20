import Loader from "@/components/shared/Loader"
import { useUserContext } from "@/context/AuthContext"
import { useGetSavedPosts } from "@/lib/react-query/queriesAndMutations"
import { BookmarkCheck } from "lucide-react"
import { Link } from "react-router-dom"

const Saved = () => {
  const { user } = useUserContext()
  const { data: savedPosts, isPending: isLoadingSavedPosts } = useGetSavedPosts(
    user.id
  )
  if (isLoadingSavedPosts) {
    return (
      <div className="w-full flex flex-col py-16 px-36">
        <div className="flex items-center space-x-2 mb-16">
          <BookmarkCheck size={24} color="white" />
          <h1 className="text-2xl font-bold">Saved Posts</h1>
        </div>
        <div>
          <Loader />
        </div>
      </div>
    )
  }

  // console.log(savedPosts)

  return (
    <div className="w-full flex flex-col py-16 px-36">
      <div className="flex items-center space-x-2 mb-16">
        <BookmarkCheck size={24} color="white" />
        <h1 className="text-2xl font-bold">Saved Posts</h1>
      </div>

      <ul className="grid-container">
        {savedPosts?.documents.map((saved) => (
          <li key={saved.$id} className="relative min-w-80 h-80">
            <Link to={`/posts/${saved.post.$id}`} className="grid-post_link">
              <img
                src={saved.post.imageUrl}
                alt="post"
                className="h-full w-full object-cover"
              />
            </Link>

            <img
              src={saved.post.creator.imageUrl}
              alt="creator"
              className="absolute bottom-4 left-4 w-8 h-8 rounded-full"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Saved
