import UserProfileForm from "@/components/forms/UserProfileForm"
import { FileEdit } from "lucide-react"


const EditProfile = () => {
  return (
    <div className="flex flex-1 ">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <button>
            <FileEdit size={36} color="black" />
          </button>
          <h2 className="font-bold">Edit User Profile</h2>
        </div>

        <UserProfileForm />
      </div>
    </div>
  )
}

export default EditProfile
