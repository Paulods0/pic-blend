import { INewPost, INewUser, IUpdatePost } from "@/types"
import { ID, Query } from "appwrite"
import { account, appWriteConfig, avatars, databases, storage } from "./config"

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    )
    if (!newAccount) throw Error

    const avatarUrl = avatars.getInitials(user.name)

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    })

    return newUser
  } catch (error) {
    // console.log(error)
    return error
  }
}
export async function saveUserToDB(user: {
  accountId: string
  email: string
  name: string
  imageUrl: URL
  username?: string
}) {
  try {
    const newUser = await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.userCollectionId,
      ID.unique(),
      user
    )

    return newUser
  } catch (error) {
    // console.log(error)
  }
}
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password)

    return session
  } catch (error) {
    // console.log(error)
  }
}
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get()

    if (!currentAccount) throw Error

    const currentUser = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    )
    if (!currentUser) throw Error

    return currentUser.documents[0]
  } catch (error) {
    // console.log(error)
  }
}
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current")

    return session
  } catch (error) {
    // console.log(error)
  }
}
export async function createPost(post: INewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0])
    if (!uploadedFile) throw Error

    const fileUrl = getFilePreview(uploadedFile.$id)

    if (!fileUrl) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }
    const tags = post.tags?.replace(/ /g, "").split(",") || []

    const newPost = await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postColletionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    )
    if (!newPost) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }
    return newPost
  } catch (error) {
    // console.log(error)
  }
}
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appWriteConfig.storgeId,
      ID.unique(),
      file
    )
    return uploadedFile
  } catch (error) {
    // console.log(error)
  }
}
export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appWriteConfig.storgeId,
      fileId,
      2000,
      2000,
      "top",
      100
    )
    return fileUrl
  } catch (error) {
    // console.log(error)
  }
}
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appWriteConfig.storgeId, fileId)
    return { success: "Ok" }
  } catch (error) {
    // console.log(error)
  }
}
export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postColletionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    )
    if (!posts) throw Error
    return posts
  } catch (error) {
    // console.log(error)
  }
}
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postColletionId,
      postId,
      {
        likes: likesArray,
      }
    )

    if (!updatedPost) throw Error

    return updatedPost
  } catch (error) {
    // console.log(error)
  }
}
export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.savesColletionId,
      ID.unique(),
      {
        post: postId,
        user: userId,
      }
    )
    if (!updatedPost) throw Error
    return updatedPost
  } catch (error) {
    // console.log(error)
  }
}
export async function deleteSavePost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appWriteConfig.databaseId,
      appWriteConfig.savesColletionId,
      savedRecordId
    )
    if (!statusCode) throw Error
    return { status: "ok" }
  } catch (error) {
    // console.log(error)
  }
}
export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postColletionId,
      postId
    )

    return post
  } catch (error) {
    // console.log(error)
  }
}
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    }

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0])
      if (!uploadedFile) throw Error

      const fileUrl = getFilePreview(uploadedFile.$id)

      // console.log({ fileUrl })

      if (!fileUrl) {
        deleteFile(uploadedFile.$id)
        throw Error
      }
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
    }
    const tags = post.tags?.replace(/ /g, "").split(",") || []

    const updatedPost = await databases.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postColletionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    )
    if (!updatedPost) {
      await deleteFile(post.imageId)
      throw Error
    }
    return updatedPost
  } catch (error) {
    // console.log(error)
  }
}
export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error

  try {
    await databases.deleteDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postColletionId,
      postId
    )
    return { success: "Ok" }
  } catch (error) {
    // console.log(error)
  }
}
export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)]

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()))
  }

  try {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postColletionId,
      queries
    )

    if (!posts) throw Error

    return posts
  } catch (error) {
    // console.log(error)
  }
}
export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postColletionId,
      [Query.search("caption", searchTerm)]
    )
    if (!posts) throw Error
    return posts
  } catch (error) {
    // console.log(error)
  }
}
export async function getSavedPosts(userId: string) {
  try {
    const userIdFromSaves = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.savesColletionId,
      [Query.equal("user", userId), Query.orderDesc("$createdAt")]
    )
    if (!userIdFromSaves) throw Error

    // console.log(userIdFromSaves)

    return userIdFromSaves
  } catch (error) {
    // console.log(error)
  }
}
export async function getSavedPostsById(savedPostId: string) {
  try {
    const savedPosts = await databases.getDocument(
      appWriteConfig.databaseId,
      appWriteConfig.savesColletionId,
      savedPostId
    )
    if (!savedPosts) throw Error
    return savedPosts
  } catch (error) {
    // console.log("getSavedPostsById ~ error", error)
  }
}
export async function getUserPosts(userId: string) {
  try {
    const userPosts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postColletionId,
      [Query.equal("creator", userId)]
    )

    if (!userPosts.documents.length) return []

    const posts = userPosts.documents.map((post) => post)
    // console.log(posts)
    return posts
  } catch (error) {
    // console.log(error)
  }
}

export async function getUserLikedPosts(userId: string) {
  try {
    const user = await databases.getDocument(
      appWriteConfig.databaseId,
      appWriteConfig.userCollectionId,
      userId
    )
    if (!user) throw Error

    const postIds = user.liked.map((likes: any) => likes.$id)

    const likedPosts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postColletionId,
      [Query.equal("$id", postIds)]
    )

    const posts = likedPosts.documents.map((post) => post)
    // console.log(posts)
    return posts
  } catch (error) {
    // console.error(error)
    // throw new Error("Erro ao obter posts curtidos pelo usuário")
  }
}
