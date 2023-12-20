import Logo from "@/components/shared/Logo"
import { Outlet, Navigate } from "react-router-dom"

const AuthLayout = () => {
  const isAuthenticated = false
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <div className="h-screen hidden w-1/2 lg:flex items-center flex-col justify-center">
            <div className="hidden xl:block mb-12">
              <Logo large />
            </div>
            <p className="text-center hidden xl:block text-pink-500">
              PicBlend, a captivating platform that transcends ordinary
              photo-sharing, is where visual storytelling meets artistic
              expression. With PicBlend, every image becomes a canvas, and every
              user is an artist, weaving narratives through a tapestry of
              pixels.
            </p>
          </div>

          <section className="flex bg-light-1 flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>
        </>
      )}
    </>
  )
}

export default AuthLayout
