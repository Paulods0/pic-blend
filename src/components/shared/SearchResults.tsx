import { Models } from "appwrite"
import GridPostList from "./GridPostList"
import Loader from "./Loader"

type SearchResultProps = {
  isSearchFetching: boolean
  searchedPosts: Models.Document[]
}

const SearchResults = ({
  isSearchFetching,
  searchedPosts,
}: SearchResultProps) => {
  if (isSearchFetching) return <Loader />
  // searchedPosts.length
  //@ts-ignore
  if (searchedPosts && searchedPosts.documents.length > 0) {
    //@ts-ignore
    return <GridPostList posts={searchedPosts.documents} />
  }

  return (
    <p className="text light-4 mt-10 text-center w-full">No results found</p>
  )
}

export default SearchResults
