import { sidebarLinks } from "@/constants"
import { useUserContext } from "@/context/AuthContext"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { INavLink } from "@/types"
import { useEffect } from "react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { LogOut } from "lucide-react"
LogOut

const LeftSidebar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount()

  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user } = useUserContext()

  useEffect(() => {
    if (isSuccess) navigate(0)
  }, [isSuccess])

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-8">
        <Link to="/" className="flex gap-3 items-center">
          {/* <h1 className="text-3xl font-bold text-pink-500 cursive">PicBlend</h1> */}
          <div className="relative w-36 h-16">
            <img
              src="/public/assets/icons/PicBlend.svg"
              alt=""
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </Link>
        <Link to={`/profile/${user.id}`} className="flex gap-2 items-center">
          <img
            src={user.imageUrl || "/assets/images/social-1.jpeg"}
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">{user.email}</p>
          </div>
        </Link>
        <ul className="flex flex-col gap-2">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route
            return (
              <li
                key={link.label}
                className={`leftsidebar-link ${isActive && "bg-pink-500"}`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-2"
                >
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
      <Button
        onClick={() => signOut()}
        variant="ghost"
        className="shad-button_ghost bg-black text-white w-fit"
      >
        <LogOut color="white" size={24} />
        Logout
      </Button>
    </nav>
  )
}

export default LeftSidebar
