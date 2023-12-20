import { bottombarLinks, sidebarLinks } from "@/constants"
import { INavLink } from "@/types"
import { Link, NavLink, useLocation } from "react-router-dom"

const Bottombar = () => {
  const { pathname } = useLocation()

  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link: INavLink) => {
        const isActive = pathname === link.route
        return (
          <Link
            to={link.route}
            key={link.label}
            className={`${
              isActive && "bg-white rounded-lg "
            } flex-center flex-col gap-1 p-2 transition  `}
          >
            {link.label}
          </Link>
        )
      })}
    </section>
  )
}

export default Bottombar
