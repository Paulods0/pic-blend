import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react"
import { useUserContext } from "@/context/AuthContext"

const Topbar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const { user } = useUserContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) navigate(0)
  }, [isSuccess])

  return (
    <section className="topbar shadow-lg">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center ">
          <img
            src="public/assets/icons/PicBlend.svg"
            alt="logo"
            className="h-12 w-28 object-contain bg-no-repeat "
          />
        </Link>

        <div className="flex gap-4">
          <Button
            onClick={() => signOut}
            variant="ghost"
            className="bg-dark-4 p-2 rounded-lg text-light-1"
          >
            LogOut
          </Button>
          <Link to={`profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "/assets/images/social.jpeg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Topbar
